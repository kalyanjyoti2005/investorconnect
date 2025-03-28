import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  ScreenShare,
  MessageSquare,
  Volume2,
  Maximize2,
  User,
  Loader2,
} from "lucide-react";

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: 'audio' | 'video';
}

export default function VideoCallModal({
  isOpen,
  onClose,
  participant,
  type = 'video'
}: VideoCallModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [reaction, setReaction] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Effect to handle call setup
  useEffect(() => {
    if (!isOpen) return;
    
    // Simulate connection process
    setIsConnecting(true);
    setIsConnected(false);
    
    // In a real implementation, this would be where you'd set up WebRTC
    const connectionTimer = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      // Set up local video stream
      if (localVideoRef.current && navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true })
          .then(stream => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch(error => {
            console.error("Error accessing media devices:", error);
          });
      }
    }, 2000);
    
    return () => {
      clearTimeout(connectionTimer);
      
      // Clean up media streams when component unmounts
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, type]);
  
  // Effect to handle call duration timer
  useEffect(() => {
    if (!isOpen || !isConnected) return;
    
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen, isConnected]);
  
  // Format call duration to mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle sending reaction emoji
  const handleReaction = (emoji: string) => {
    setReaction(emoji);
    setTimeout(() => setReaction(null), 2000);
  };
  
  // Animation variants for the reaction
  const reactionVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: { 
      opacity: 1, 
      scale: [1, 1.5, 1], 
      y: [0, -20, -30], 
      transition: { duration: 1 } 
    },
    exit: { opacity: 0, scale: 0.5, y: -50, transition: { duration: 0.3 } }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-background/95 backdrop-blur-sm overflow-hidden">
        <div className="relative w-full h-[600px] flex flex-col">
          {/* Main Video Area */}
          <div className="flex-1 bg-black/90 relative">
            {/* Connecting state */}
            {isConnecting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-white text-lg font-medium">Connecting...</h3>
                <p className="text-white/70 text-sm mt-2">Setting up secure connection</p>
              </div>
            )}
            
            {/* Remote Video (Participant) */}
            {isConnected && type === 'video' && !isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* This would be a real video stream in production */}
                <div className="w-full h-full flex items-center justify-center">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <User className="w-32 h-32 text-white/30 absolute" />
                </div>
                
                {/* Call duration display */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {formatDuration(callDuration)}
                </div>
                
                {/* Reaction animation */}
                <AnimatePresence>
                  {reaction && (
                    <motion.div 
                      className="absolute"
                      variants={reactionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <span className="text-6xl">{reaction}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Audio-only or video-off state */}
            {isConnected && (type === 'audio' || isVideoOff) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <Avatar className="w-32 h-32">
                  <AvatarFallback className="text-4xl">
                    {participant.name[0]}
                  </AvatarFallback>
                  {participant.avatar && (
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                  )}
                </Avatar>
                
                {/* Call duration display for audio calls */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {formatDuration(callDuration)}
                </div>
              </div>
            )}
            
            {/* Local Video (Small) */}
            {isConnected && type === 'video' && !isVideoOff && (
              <motion.div 
                className="absolute bottom-4 right-4 w-40 h-30 bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                drag
                dragConstraints={{
                  top: -300,
                  left: -500,
                  right: 0,
                  bottom: 0
                }}
                whileDrag={{ scale: 1.05 }}
                whileTap={{ scale: 1.05 }}
              >
                {/* Local video stream */}
                <div className="w-full h-full flex items-center justify-center">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <User className="w-10 h-10 text-white/30 absolute" />
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Call Controls */}
          <div className="bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{participant.name[0]}</AvatarFallback>
                {participant.avatar && (
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                )}
              </Avatar>
              
              <div>
                <h3 className="font-medium">{participant.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {type === 'video' ? 'Video Call' : 'Audio Call'} • {formatDuration(callDuration)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={isMuted ? "destructive" : "secondary"} 
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-full"
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              {type === 'video' && (
                <Button 
                  variant={isVideoOff ? "destructive" : "secondary"} 
                  size="icon"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className="rounded-full"
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
              )}
              
              <Button 
                variant="secondary" 
                size="icon"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`rounded-full ${isScreenSharing ? 'bg-primary/20' : ''}`}
              >
                <ScreenShare className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="secondary" 
                size="icon"
                className="rounded-full"
              >
                <Volume2 className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="destructive" 
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <Phone className="h-5 w-5 rotate-135" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleReaction('👍')}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  👍
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleReaction('👏')}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  👏
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleReaction('🚀')}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  🚀
                </Button>
              </div>
              
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}