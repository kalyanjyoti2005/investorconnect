import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';
import { messages } from '@shared/schema';
import { log } from './vite';
import { eq, or, and } from 'drizzle-orm';

// Type definition for message payload
interface MessagePayload {
  type: 'message';
  recipientId: number;
  senderId: number;
  content: string;
}

// Type definition for mark-read payload
interface MarkReadPayload {
  type: 'mark-read';
  messageId: number;
}

// Type for all supported payloads
type Payload = MessagePayload | MarkReadPayload;

// Map to store WebSocket connections for each user
const userConnections = new Map<number, WebSocket>();

// Set up WebSocket server
export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    let userId: number | null = null;
    
    log('WebSocket connection established', 'ws');
    
    // Handle message from client
    ws.on('message', async (data: string) => {
      try {
        const payload = JSON.parse(data) as Payload;
        
        switch (payload.type) {
          case 'message':
            // Handle new message
            if (!userId) {
              userId = payload.senderId;
              userConnections.set(userId, ws);
              log(`User ${userId} registered WebSocket connection`, 'ws');
            }
            
            // Store message in database
            const newMessage = await storage.createMessage({
              senderId: payload.senderId,
              receiverId: payload.recipientId,
              content: payload.content
            });
            
            // Create notification
            await storage.createNotification({
              userId: payload.recipientId,
              type: 'message',
              content: `New message from ${(await storage.getUser(payload.senderId))?.name}`,
              relatedId: newMessage.id
            });
            
            // Send message to recipient if they're connected
            const recipientWs = userConnections.get(payload.recipientId);
            if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
              recipientWs.send(JSON.stringify({
                type: 'new-message',
                message: newMessage
              }));
              
              log(`Message ${newMessage.id} delivered to user ${payload.recipientId}`, 'ws');
            } else {
              log(`Message ${newMessage.id} stored for offline user ${payload.recipientId}`, 'ws');
            }
            
            // Confirm to sender
            ws.send(JSON.stringify({
              type: 'message-sent',
              messageId: newMessage.id
            }));
            
            break;
            
          case 'mark-read':
            // Mark message as read
            const updatedMessage = await storage.markMessageAsRead(payload.messageId);
            
            // Notify the original sender if they're online
            if (updatedMessage) {
              const senderWs = userConnections.get(updatedMessage.senderId);
              if (senderWs && senderWs.readyState === WebSocket.OPEN) {
                senderWs.send(JSON.stringify({
                  type: 'message-read',
                  messageId: updatedMessage.id
                }));
              }
            }
            
            break;
            
          default:
            log(`Unknown message type: ${(payload as any).type}`, 'ws');
        }
      } catch (error) {
        log(`Error processing WebSocket message: ${error}`, 'ws');
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });
    
    // Handle disconnect
    ws.on('close', () => {
      if (userId) {
        userConnections.delete(userId);
        log(`User ${userId} disconnected WebSocket`, 'ws');
      }
    });
  });
  
  log('WebSocket server initialized', 'ws');
  return wss;
}