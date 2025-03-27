import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatLayout from "@/components/chat/ChatLayout";
import AIChatbot from "@/components/chat/AIChatbot";
import VideoCallModal from "@/components/chat/VideoCallModal";
import Sidebar from "@/components/sidebar";
import { MessageSquare, Video, Users, Bot, Sparkles, Zap } from "lucide-react";

export default function MessagesPage() {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');
  
  // Handle starting a call
  const startCall = (type: 'video' | 'audio') => {
    setCallType(type);
    setIsVideoCallOpen(true);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b p-4">
          <Tabs defaultValue="chat" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Messages</h1>
              
              <TabsList>
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat</span>
                </TabsTrigger>
                <TabsTrigger value="meetings" className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <span>Meetings</span>
                </TabsTrigger>
                <TabsTrigger value="ai-assistant" className="flex items-center gap-1">
                  <Bot className="h-4 w-4" />
                  <span>AI Assistant</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="space-x-2">
                <Button size="sm" onClick={() => startCall('audio')}>
                  Start Audio Call
                </Button>
                <Button size="sm" onClick={() => startCall('video')}>
                  Start Video Call
                </Button>
              </div>
            </div>
            
            <TabsContent value="chat" className="m-0 h-full">
              <ChatLayout />
            </TabsContent>
            
            <TabsContent value="meetings" className="m-0 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-muted rounded-lg p-6 text-center"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Video className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Start a Video Call</h3>
                  <p className="text-muted-foreground mb-6">
                    Meet face-to-face with investors or startups to discuss opportunities
                  </p>
                  <Button onClick={() => startCall('video')} className="w-full">
                    New Video Call
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-muted rounded-lg p-6 text-center"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Host a Group Meeting</h3>
                  <p className="text-muted-foreground mb-6">
                    Bring together multiple participants for investor pitches or team discussions
                  </p>
                  <Button variant="outline" className="w-full">
                    Create Meeting Room
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-muted rounded-lg p-6 text-center"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI-Enhanced Meetings</h3>
                  <p className="text-muted-foreground mb-6">
                    Get real-time insights, transcripts and follow-up summaries powered by AI
                  </p>
                  <Button variant="outline" className="w-full">
                    Try AI Enhancement
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="bg-muted rounded-lg p-6 text-center"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Quick Pitch Sessions</h3>
                  <p className="text-muted-foreground mb-6">
                    Practice your 3-minute pitch with instant feedback from expert mentors
                  </p>
                  <Button variant="outline" className="w-full">
                    Book Pitch Session
                  </Button>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="ai-assistant" className="m-0 p-4">
              <div className="max-w-3xl mx-auto bg-muted rounded-lg p-8">
                <div className="text-center mb-8">
                  <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Bot className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">StartupMatch AI Assistant</h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Your personal AI assistant for startup advice, investment tips, and pitch refinement. 
                    Click the button below to start a conversation.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">For Founders</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        Pitch deck refinement
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        Business model validation
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        Startup valuation help
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        Investor outreach strategies
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">For Investors</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        Portfolio diversification
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        Startup evaluation metrics
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        ROI calculation tools
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        Term sheet recommendations
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Button size="lg" onClick={() => document.querySelector('.ai-chatbot-toggle')?.dispatchEvent(new Event('click'))}>
                    Chat with AI Assistant
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        participant={{ id: '1', name: 'John Doe' }}
        type={callType}
      />
      
      {/* AI Chatbot */}
      <AIChatbot />
      
      {/* Hidden button for programmatic opening of chatbot */}
      <button className="ai-chatbot-toggle hidden" />
    </div>
  );
}