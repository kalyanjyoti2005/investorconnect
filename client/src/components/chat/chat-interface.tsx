import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useWebSocket } from '@/hooks/use-websocket';
import { Message } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  recipientId: number;
  recipientName: string;
}

export function ChatInterface({ recipientId, recipientName }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const { sendMessage, markAsRead, lastMessage } = useWebSocket(user?.id);
  
  // Fetch conversation history
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages', recipientId],
    enabled: !!user,
  });
  
  // Use mutation to mark messages as read
  const markReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const res = await apiRequest('PUT', `/api/messages/${messageId}/read`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', recipientId] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, lastMessage]);
  
  // Mark unread messages as read
  useEffect(() => {
    if (messages && user) {
      const unreadMessages = messages.filter(
        msg => msg.status === 'unread' && msg.receiverId === user.id
      );
      
      // Mark messages as read both via API and WebSocket
      unreadMessages.forEach(msg => {
        markReadMutation.mutate(msg.id);
        markAsRead(msg.id);
      });
    }
  }, [messages, user, markReadMutation, markAsRead]);
  
  // Update messages when receiving new ones via WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'new-message') {
      // If the new message is part of this conversation
      const msg = lastMessage.message;
      if ((msg.senderId === recipientId && msg.receiverId === user?.id) || 
          (msg.receiverId === recipientId && msg.senderId === user?.id)) {
        queryClient.invalidateQueries({ queryKey: ['/api/messages', recipientId] });
        
        // If we're the recipient, mark as read
        if (msg.receiverId === user?.id) {
          markReadMutation.mutate(msg.id);
          markAsRead(msg.id);
        }
      }
    }
  }, [lastMessage, recipientId, user?.id, markReadMutation, markAsRead]);
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;
    
    // Send via WebSocket
    sendMessage(recipientId, newMessage);
    setNewMessage('');
    
    // We don't need to manually update the messages state or invalidate queries
    // as the WebSocket server will send back a confirmation which will trigger
    // the appropriate useEffect hook
  };
  
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Format message time
  const formatMessageTime = (timestamp: Date) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <Card className="flex flex-col h-[70vh]">
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>{recipientName ? getInitials(recipientName) : '?'}</AvatarFallback>
          </Avatar>
          {recipientName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.senderId === user?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="mb-1">{message.content}</div>
                    <div className="text-xs opacity-70 flex justify-between items-center">
                      <span>{formatMessageTime(message.createdAt)}</span>
                      {message.senderId === user?.id && (
                        <Badge variant="outline" className="text-[10px] ml-2 py-0 h-4">
                          {message.status === 'read' ? 'Read' : 'Sent'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        <form 
          className="flex w-full gap-2" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}