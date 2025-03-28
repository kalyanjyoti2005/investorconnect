import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Define message types
export interface BaseMessage {
  id: string;
  timestamp: Date;
}

export interface ChatMessage extends BaseMessage {
  type: 'message';
  roomId: string;
  senderId: string;
  senderName: string;
  text: string;
  isRead: boolean;
}

export interface TypingMessage extends BaseMessage {
  type: 'typing';
  roomId: string;
  senderId: string;
  isTyping: boolean;
}

export interface CallMessage extends BaseMessage {
  type: 'call';
  callId: string;
  callerId: string;
  callerName: string;
  recipientId: string;
  callType: 'audio' | 'video';
  action: 'start' | 'answer' | 'end' | 'reject';
  sdp?: string;
  candidates?: any[];
}

export interface ReadReceiptMessage extends BaseMessage {
  type: 'read_receipt';
  roomId: string;
  messageIds: string[];
  readerId: string;
}

export interface AuthMessage {
  type: 'auth';
  userId: string;
}

export interface ErrorMessage {
  type: 'error';
  message: string;
  timestamp: number;
}

export type ClientMessage = ChatMessage | TypingMessage | CallMessage | ReadReceiptMessage | AuthMessage;

// Define chat room
export interface ChatRoom {
  id: string;
  name: string;
  type: 'one-on-one' | 'group' | 'hackathon' | 'community';
  icon?: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

// Chat context type
interface ChatContextType {
  // WebSocket connection
  socket: WebSocket | null;
  isConnected: boolean;
  connecting: boolean;

  // Chat data
  chatRooms: ChatRoom[];
  activeRoom: string | null;
  messages: Record<string, ChatMessage[]>;
  
  // User states
  typingUsers: Record<string, string[]>;
  
  // Call states
  currentCall: CallMessage | null;
  incomingCall: CallMessage | null;

  // Actions
  setActiveRoom: (roomId: string | null) => void;
  sendMessage: (roomId: string, text: string) => void;
  sendTypingStatus: (roomId: string, isTyping: boolean) => void;
  markAsRead: (roomId: string, messageIds: string[]) => void;
  
  // Call actions
  initiateCall: (recipientId: string, callType: 'audio' | 'video') => void;
  answerCall: (callId: string) => void;
  rejectCall: (callId: string) => void;
  endCall: (callId: string) => void;
}

// Create the ChatContext
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create a provider component
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();

  // WebSocket states
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Chat data states
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  
  // User states
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  
  // Call states
  const [currentCall, setCurrentCall] = useState<CallMessage | null>(null);
  const [incomingCall, setIncomingCall] = useState<CallMessage | null>(null);

  // Function to establish WebSocket connection
  useEffect(() => {
    if (!user) return;

    const connectWebSocket = () => {
      try {
        setConnecting(true);
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connection established');
          setIsConnected(true);
          setConnecting(false);
          
          // Send auth message
          const authMessage: AuthMessage = {
            type: 'auth',
            userId: user.id.toString()
          };
          ws.send(JSON.stringify(authMessage));
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
          setConnecting(false);
          
          toast({
            title: 'Connection Error',
            description: 'Failed to connect to chat server. Please try again later.',
            variant: 'destructive',
          });
        };
        
        ws.onclose = () => {
          console.log('WebSocket connection closed');
          setIsConnected(false);
          setConnecting(false);
          
          // Try to reconnect after a delay
          setTimeout(connectWebSocket, 5000);
        };
        
        setSocket(ws);
      } catch (error) {
        console.error('Failed to establish WebSocket connection:', error);
        setConnecting(false);
        setIsConnected(false);
      }
    };
    
    connectWebSocket();
    
    // Clean up function
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user]);

  // Function to handle incoming WebSocket messages
  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'auth_success':
        console.log('Authentication successful:', data);
        break;
        
      case 'message':
        handleChatMessage(data as ChatMessage);
        break;
        
      case 'typing':
        handleTypingMessage(data as TypingMessage);
        break;
        
      case 'call':
        handleCallMessage(data as CallMessage);
        break;
        
      case 'read_receipt':
        handleReadReceipt(data as ReadReceiptMessage);
        break;
        
      case 'error':
        handleErrorMessage(data as ErrorMessage);
        break;
        
      default:
        console.log('Unknown message type:', data);
    }
  };

  // Handler for chat messages
  const handleChatMessage = (message: ChatMessage) => {
    setMessages(prevMessages => {
      const roomMessages = [...(prevMessages[message.roomId] || [])];
      
      // Check if message already exists
      const messageExists = roomMessages.some(msg => msg.id === message.id);
      if (messageExists) return prevMessages;
      
      return {
        ...prevMessages,
        [message.roomId]: [...roomMessages, message].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      };
    });
    
    // Update chat rooms with last message
    setChatRooms(prevRooms => {
      const updatedRooms = [...prevRooms];
      const roomIndex = updatedRooms.findIndex(room => room.id === message.roomId);
      
      if (roomIndex !== -1) {
        // Update existing room
        const updatedRoom = { ...updatedRooms[roomIndex] };
        updatedRoom.lastMessage = message;
        
        // If not the active room or message is from another user, increment unread count
        if (activeRoom !== message.roomId && message.senderId !== user?.id.toString()) {
          updatedRoom.unreadCount = (updatedRoom.unreadCount || 0) + 1;
        }
        
        updatedRooms[roomIndex] = updatedRoom;
      } else {
        // Create new room if it doesn't exist
        updatedRooms.push({
          id: message.roomId,
          name: message.senderName, // Temporary name, would be fetched from API
          type: 'one-on-one',
          participants: [message.senderId, user?.id.toString() || ''],
          lastMessage: message,
          unreadCount: activeRoom !== message.roomId ? 1 : 0
        });
      }
      
      return updatedRooms;
    });
    
    // Show toast for new messages when not in the current room
    if (activeRoom !== message.roomId && message.senderId !== user?.id.toString()) {
      toast({
        title: message.senderName,
        description: message.text.length > 50 ? `${message.text.substring(0, 50)}...` : message.text,
        variant: 'default',
      });
    }
  };

  // Handler for typing status
  const handleTypingMessage = (message: TypingMessage) => {
    if (message.senderId === user?.id.toString()) return;
    
    setTypingUsers(prev => {
      const roomTypers = [...(prev[message.roomId] || [])];
      
      if (message.isTyping) {
        // Add user to typing list if not already there
        if (!roomTypers.includes(message.senderId)) {
          return { ...prev, [message.roomId]: [...roomTypers, message.senderId] };
        }
      } else {
        // Remove user from typing list
        return { 
          ...prev, 
          [message.roomId]: roomTypers.filter(id => id !== message.senderId) 
        };
      }
      
      return prev;
    });
  };

  // Handler for call messages
  const handleCallMessage = (message: CallMessage) => {
    switch (message.action) {
      case 'start':
        if (message.recipientId === user?.id.toString()) {
          setIncomingCall(message);
          
          toast({
            title: 'Incoming Call',
            description: `${message.callerName} is calling you.`,
            variant: 'default',
            duration: 10000,
          });
        }
        break;
        
      case 'answer':
        if (message.callerId === user?.id.toString()) {
          setCurrentCall(message);
        }
        break;
        
      case 'reject':
        if (message.callerId === user?.id.toString()) {
          setCurrentCall(null);
          
          toast({
            title: 'Call Rejected',
            description: 'Your call was rejected.',
            variant: 'default',
          });
        }
        break;
        
      case 'end':
        if ((message.callerId === user?.id.toString() || message.recipientId === user?.id.toString()) && currentCall) {
          setCurrentCall(null);
          setIncomingCall(null);
          
          toast({
            title: 'Call Ended',
            description: 'The call has ended.',
            variant: 'default',
          });
        }
        break;
    }
  };

  // Handler for read receipts
  const handleReadReceipt = (message: ReadReceiptMessage) => {
    setMessages(prevMessages => {
      const roomMessages = [...(prevMessages[message.roomId] || [])];
      
      if (roomMessages.length === 0) return prevMessages;
      
      const updatedMessages = roomMessages.map(msg => {
        if (message.messageIds.includes(msg.id) && msg.senderId === user?.id.toString()) {
          return { ...msg, isRead: true };
        }
        return msg;
      });
      
      return { ...prevMessages, [message.roomId]: updatedMessages };
    });
  };

  // Handler for error messages
  const handleErrorMessage = (message: ErrorMessage) => {
    toast({
      title: 'Error',
      description: message.message,
      variant: 'destructive',
    });
  };

  // Function to send a message
  const sendMessage = (roomId: string, text: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user) return;
    
    const message: ChatMessage = {
      type: 'message',
      id: `local-${Date.now()}`,
      roomId,
      senderId: user.id.toString(),
      senderName: user.username,
      text,
      timestamp: new Date(),
      isRead: false
    };
    
    socket.send(JSON.stringify(message));
    
    // Optimistically add message to state
    handleChatMessage(message);
  };

  // Function to send typing status
  const sendTypingStatus = (roomId: string, isTyping: boolean) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user) return;
    
    const message: TypingMessage = {
      type: 'typing',
      id: `typing-${Date.now()}`,
      roomId,
      senderId: user.id.toString(),
      isTyping,
      timestamp: new Date()
    };
    
    socket.send(JSON.stringify(message));
  };

  // Function to mark messages as read
  const markAsRead = (roomId: string, messageIds: string[]) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user) return;
    
    const message: ReadReceiptMessage = {
      type: 'read_receipt',
      id: `read-${Date.now()}`,
      roomId,
      messageIds,
      readerId: user.id.toString(),
      timestamp: new Date()
    };
    
    socket.send(JSON.stringify(message));
    
    // Update local state
    setMessages(prevMessages => {
      const roomMessages = [...(prevMessages[roomId] || [])];
      
      if (roomMessages.length === 0) return prevMessages;
      
      const updatedMessages = roomMessages.map(msg => {
        if (messageIds.includes(msg.id)) {
          return { ...msg, isRead: true };
        }
        return msg;
      });
      
      return { ...prevMessages, [roomId]: updatedMessages };
    });
    
    // Reset unread count for the room
    setChatRooms(prevRooms => {
      return prevRooms.map(room => {
        if (room.id === roomId) {
          return { ...room, unreadCount: 0 };
        }
        return room;
      });
    });
  };

  // Function to initiate a call
  const initiateCall = (recipientId: string, callType: 'audio' | 'video') => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user) return;
    
    const callId = `call-${Date.now()}`;
    
    const message: CallMessage = {
      type: 'call',
      id: callId,
      callId,
      callerId: user.id.toString(),
      callerName: user.username,
      recipientId,
      callType,
      action: 'start',
      timestamp: new Date()
    };
    
    socket.send(JSON.stringify(message));
    setCurrentCall(message);
  };

  // Function to answer a call
  const answerCall = (callId: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user || !incomingCall) return;
    
    const message: CallMessage = {
      ...incomingCall,
      id: `answer-${Date.now()}`,
      action: 'answer',
      timestamp: new Date()
    };
    
    socket.send(JSON.stringify(message));
    setCurrentCall(message);
    setIncomingCall(null);
  };

  // Function to reject a call
  const rejectCall = (callId: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user || !incomingCall) return;
    
    const message: CallMessage = {
      ...incomingCall,
      id: `reject-${Date.now()}`,
      action: 'reject',
      timestamp: new Date()
    };
    
    socket.send(JSON.stringify(message));
    setIncomingCall(null);
  };

  // Function to end a call
  const endCall = (callId: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user || !currentCall) return;
    
    const message: CallMessage = {
      ...currentCall,
      id: `end-${Date.now()}`,
      action: 'end',
      timestamp: new Date()
    };
    
    socket.send(JSON.stringify(message));
    setCurrentCall(null);
  };

  // Fetch chat rooms and messages on init
  useEffect(() => {
    const fetchChatData = async () => {
      if (!user) return;
      
      try {
        // Fetch chat rooms
        const roomsResponse = await fetch('/api/chat/rooms');
        if (roomsResponse.ok) {
          const roomsData = await roomsResponse.json();
          setChatRooms(roomsData);
        }
        
        // Fetch recent messages for each room
        if (chatRooms.length > 0) {
          const messagesPromises = chatRooms.map(async (room) => {
            const messagesResponse = await fetch(`/api/chat/messages/${room.id}`);
            if (messagesResponse.ok) {
              const messagesData = await messagesResponse.json();
              return { roomId: room.id, messages: messagesData };
            }
            return { roomId: room.id, messages: [] };
          });
          
          const messagesResults = await Promise.all(messagesPromises);
          const messagesMap: Record<string, ChatMessage[]> = {};
          
          messagesResults.forEach(result => {
            messagesMap[result.roomId] = result.messages;
          });
          
          setMessages(messagesMap);
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };
    
    fetchChatData();
  }, [user]);

  // Mark messages as read when activeRoom changes
  useEffect(() => {
    if (!activeRoom) return;
    
    const unreadMessages = messages[activeRoom]?.filter(
      msg => !msg.isRead && msg.senderId !== user?.id.toString()
    ) || [];
    
    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map(msg => msg.id);
      markAsRead(activeRoom, messageIds);
    }
  }, [activeRoom, messages]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        isConnected,
        connecting,
        chatRooms,
        activeRoom,
        messages,
        typingUsers,
        currentCall,
        incomingCall,
        setActiveRoom,
        sendMessage,
        sendTypingStatus,
        markAsRead,
        initiateCall,
        answerCall,
        rejectCall,
        endCall
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// Hook to use chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}