import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// WebSocket connection status
export type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error';

// WebSocket hook interface
interface UseWebSocketReturn {
  status: WebSocketStatus;
  sendMessage: (recipientId: number, content: string) => void;
  markAsRead: (messageId: number) => void;
  lastMessage: any | null;
}

export function useWebSocket(userId: number | undefined): UseWebSocketReturn {
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  // Initialize WebSocket connection
  useEffect(() => {
    if (!userId) return;

    // Only create a new connection if one doesn't exist
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      // Determine if using HTTPS or HTTP
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      setStatus('connecting');
      
      // Create WebSocket connection
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      // Connection opened
      socket.addEventListener('open', () => {
        setStatus('open');
        console.log('WebSocket connection established');
      });

      // Listen for messages
      socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          setLastMessage(data);
          
          // Handle specific message types
          if (data.type === 'new-message') {
            toast({
              title: 'New Message',
              description: 'You have received a new message',
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      // Connection closed
      socket.addEventListener('close', () => {
        setStatus('closed');
        console.log('WebSocket connection closed');
      });

      // Connection error
      socket.addEventListener('error', (event) => {
        setStatus('error');
        console.error('WebSocket error:', event);
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to messaging service',
          variant: 'destructive',
        });
      });
    }

    // Cleanup function
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [userId, toast]);

  // Send a message through WebSocket
  const sendMessage = useCallback((recipientId: number, content: string) => {
    if (!userId) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messagePayload = {
        type: 'message',
        senderId: userId,
        recipientId,
        content
      };
      socketRef.current.send(JSON.stringify(messagePayload));
    } else {
      toast({
        title: 'Connection Error',
        description: 'Not connected to messaging service',
        variant: 'destructive',
      });
    }
  }, [userId, toast]);

  // Mark a message as read
  const markAsRead = useCallback((messageId: number) => {
    if (!userId) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const markReadPayload = {
        type: 'mark-read',
        messageId
      };
      socketRef.current.send(JSON.stringify(markReadPayload));
    }
  }, [userId]);

  return {
    status,
    sendMessage,
    markAsRead,
    lastMessage
  };
}