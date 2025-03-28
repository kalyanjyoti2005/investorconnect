import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useAI, MessagePurpose } from "@/hooks/use-ai";
import { useToast } from "@/hooks/use-toast";
import { useChat, ChatMessage as WebSocketChatMessage, ChatRoom as WebSocketChatRoom } from "@/context/chat-context";
import { AIMessageGeneratorButton } from "./AIMessageGenerator";
import {
  Search,
  Menu,
  Settings,
  Phone,
  Video,
  Send,
  Paperclip,
  Mic,
  Image,
  User,
  Users,
  MessageSquare,
  Bell,
  ArrowRight,
  MoreVertical,
  Smile,
  Loader2,
  Bot,
  Wand2,
  AlertCircle,
} from "lucide-react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Types
interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
  unreadCount?: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  media?: {
    type: 'image' | 'file' | 'voice';
    url: string;
    thumbnail?: string;
    name?: string;
    size?: number;
  };
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'one-on-one' | 'group' | 'hackathon' | 'community';
  icon?: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

// Sample data placeholder (this would come from your backend)
const sampleUsers: ChatUser[] = [];

const sampleChatRooms: ChatRoom[] = [];

const sampleMessages: Record<string, ChatMessage[]> = {};

// Main Chat Layout Component
export default function ChatLayout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    chatRooms, 
    activeRoom, 
    setActiveRoom, 
    messages, 
    sendMessage: wsSendMessage, 
    typingUsers,
    sendTypingStatus,
    isConnected,
    connecting,
    initiateCall
  } = useChat();
  
  const [activeTab, setActiveTab] = useState<string>("direct");
  const [selectedChat, setSelectedChat] = useState<string | null>(activeRoom);
  const [message, setMessage] = useState<string>("");
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Convert WebSocket message format to local format
  const convertMessage = (wsMessage: WebSocketChatMessage): ChatMessage => {
    return {
      id: wsMessage.id,
      senderId: wsMessage.senderId,
      text: wsMessage.text,
      timestamp: new Date(wsMessage.timestamp),
      isRead: wsMessage.isRead
    };
  };
  
  // Effect to update selected chat when activeRoom changes
  useEffect(() => {
    if (activeRoom) {
      setSelectedChat(activeRoom);
    }
  }, [activeRoom]);
  
  // Effect to update activeRoom when selectedChat changes
  useEffect(() => {
    if (selectedChat && selectedChat !== activeRoom) {
      setActiveRoom(selectedChat);
    }
  }, [selectedChat, activeRoom, setActiveRoom]);
  
  // Convert chatRooms to local format
  const convertedChatRooms: ChatRoom[] = chatRooms.map(wsRoom => ({
    id: wsRoom.id,
    name: wsRoom.name,
    type: wsRoom.type,
    icon: wsRoom.icon,
    participants: wsRoom.participants,
    lastMessage: wsRoom.lastMessage ? convertMessage(wsRoom.lastMessage) : undefined,
    unreadCount: wsRoom.unreadCount
  }));
  
  // Filter chats by search query
  const filteredChatRooms = convertedChatRooms.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Effect to load messages when a chat is selected
  useEffect(() => {
    if (selectedChat && messages[selectedChat]) {
      // Convert messages to local format
      const convertedMessages = messages[selectedChat].map(convertMessage);
      setCurrentMessages(convertedMessages);
    } else {
      setCurrentMessages([]);
    }
  }, [selectedChat, messages]);
  
  // Check if a user is typing in the selected chat
  const isTyping = selectedChat && typingUsers[selectedChat] && typingUsers[selectedChat].length > 0;
  
  // Get typing users for display
  const typingUserIds = selectedChat ? typingUsers[selectedChat] || [] : [];
  
  // Handle send message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat || !user) return;
    
    // Send message through WebSocket
    wsSendMessage(selectedChat, message);
    
    // Clear input
    setMessage("");
    
    // Clear typing status
    sendTypingStatus(selectedChat, false);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };
  
  // UI component for chat contact
  const ChatContact = ({ room }: { room: ChatRoom }) => (
    <motion.div 
      variants={itemVariants}
      onClick={() => setSelectedChat(room.id)}
      className={`flex items-center p-3 gap-3 rounded-lg cursor-pointer transition-colors ${
        selectedChat === room.id ? 'bg-primary/10' : 'hover:bg-muted'
      }`}
    >
      {room.type === 'one-on-one' ? (
        <Avatar className="h-10 w-10">
          <AvatarFallback>{room.name[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          {room.type === 'group' && <Users className="h-5 w-5" />}
          {room.type === 'hackathon' && <MessageSquare className="h-5 w-5" />}
          {room.type === 'community' && <Users className="h-5 w-5" />}
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="font-medium truncate">{room.name}</span>
          {room.lastMessage && (
            <span className="text-xs text-muted-foreground">
              {new Date(room.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          {room.lastMessage ? (
            <span className="text-sm text-muted-foreground truncate">
              {room.lastMessage.text.substring(0, 30)}
              {room.lastMessage.text.length > 30 ? '...' : ''}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground italic">No messages yet</span>
          )}
          
          {!!room.unreadCount && (
            <span className="rounded-full bg-primary text-primary-foreground text-xs px-2 py-1 min-w-[20px] text-center">
              {room.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
  
  // UI component for a message bubble
  const MessageBubble = ({ message, isCurrentUser }: { message: ChatMessage, isCurrentUser: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mr-2 mt-1">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`
        max-w-[70%] px-4 py-2 rounded-lg
        ${isCurrentUser 
          ? 'bg-primary text-primary-foreground rounded-tr-none' 
          : 'bg-muted rounded-tl-none'}
      `}>
        <div className="flex items-end gap-2">
          <p className="text-sm break-words">{message.text}</p>
          <span className="text-xs opacity-70 whitespace-nowrap">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        {isCurrentUser && (
          <div className="flex justify-end mt-1">
            <span className="text-xs opacity-70">
              {message.isRead ? (
                <span>✓✓</span>
              ) : (
                <span>✓</span>
              )}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
  
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Contacts & Chat List */}
      <div className="w-72 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="direct" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
          <div className="px-2 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="direct" className="flex-1">Direct</TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
              <TabsTrigger value="public" className="flex-1">Public</TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1 p-2">
            <TabsContent value="direct" className="m-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                {filteredChatRooms.length > 0 ? (
                  filteredChatRooms
                    .filter(room => room.type === 'one-on-one')
                    .map(room => <ChatContact key={room.id} room={room} />)
                ) : (
                  <div className="text-center py-10">
                    <User className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-medium mb-1">No direct messages</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with founders and investors
                    </p>
                    <Button>Start a conversation</Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="groups" className="m-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                {filteredChatRooms.length > 0 ? (
                  filteredChatRooms
                    .filter(room => room.type === 'group' || room.type === 'hackathon')
                    .map(room => <ChatContact key={room.id} room={room} />)
                ) : (
                  <div className="text-center py-10">
                    <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-medium mb-1">No group chats</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join or create a group conversation
                    </p>
                    <Button>Create a group</Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="public" className="m-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible" 
                className="space-y-1"
              >
                {filteredChatRooms.length > 0 ? (
                  filteredChatRooms
                    .filter(room => room.type === 'community')
                    .map(room => <ChatContact key={room.id} room={room} />)
                ) : (
                  <div className="text-center py-10">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-medium mb-1">No community channels</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join public channels to discuss startups & investments
                    </p>
                    <Button>Browse channels</Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {sampleChatRooms.find(room => room.id === selectedChat)?.name[0] || 'C'}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium">
                    {sampleChatRooms.find(room => room.id === selectedChat)?.name || 'Chat'}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              {currentMessages.length > 0 ? (
                currentMessages.map(msg => (
                  <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    isCurrentUser={msg.senderId === "current-user-id"} 
                  />
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start the conversation with a message. Share thoughts, documents, or schedule a call.
                    </p>
                    <Button>Start Conversation</Button>
                  </div>
                </div>
              )}
              
              {isTyping && (
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg inline-flex">
                    <motion.div
                      className="flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
                      />
                    </motion.div>
                  </div>
                </div>
              )}
            </ScrollArea>
            
            {/* Chat Input */}
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button variant="ghost" size="icon">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button 
                  variant="default" 
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <MessageSquare className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-40" />
              <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
              <p className="text-muted-foreground mb-8">
                Connect with startup founders, investors, and mentors. Share ideas, documents, and schedule meetings.
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button className="w-full">New Message</Button>
                <Button variant="outline" className="w-full">Join Community Channel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Right Sidebar - Profile & Details (Optional, can be collapsed) */}
      {selectedChat && (
        <div className="w-64 border-l hidden lg:block">
          <div className="p-4 flex flex-col items-center border-b">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarFallback className="text-xl">
                {sampleChatRooms.find(room => room.id === selectedChat)?.name[0] || 'C'}
              </AvatarFallback>
            </Avatar>
            
            <h3 className="font-bold text-lg">
              {sampleChatRooms.find(room => room.id === selectedChat)?.name || 'Chat'}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">Startup Founder</p>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <h4 className="font-medium mb-3">Shared Files</h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 border rounded-lg">
                <Image className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate flex-1">pitch-deck.pdf</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}