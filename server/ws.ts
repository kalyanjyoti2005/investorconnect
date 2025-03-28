import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { randomUUID } from 'crypto';

// Define message types
interface BaseMessage {
  type: string;
  timestamp: number;
}

interface ChatMessage extends BaseMessage {
  type: 'message';
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  text: string;
  isRead: boolean;
}

interface TypingMessage extends BaseMessage {
  type: 'typing';
  roomId: string;
  senderId: string;
  isTyping: boolean;
}

interface CallMessage extends BaseMessage {
  type: 'call';
  callId: string;
  callerId: string;
  callerName: string;
  recipientId: string;
  callType: 'audio' | 'video';
  action: 'start' | 'answer' | 'end' | 'reject';
  sdp?: string;
  candidates?: RTCIceCandidate[];
}

interface ReadReceiptMessage extends BaseMessage {
  type: 'read_receipt';
  roomId: string;
  messageIds: string[];
  readerId: string;
}

type ServerMessage = ChatMessage | TypingMessage | CallMessage | ReadReceiptMessage;

// Client connection tracking
interface Client {
  userId: string;
  connection: WebSocket;
}

let clients: Client[] = [];

// Initialize WebSocket server
export function setupWebSocketServer(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    // New connection handler
    console.log('New WebSocket connection established');
    let userId = "";
    
    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        
        // First message should be authentication
        if (message.type === 'auth') {
          userId = message.userId || `anonymous-${randomUUID()}`;
          clients.push({ userId, connection: ws });
          console.log(`User ${userId} authenticated`);
          
          // Send acknowledgement
          ws.send(JSON.stringify({
            type: 'auth_success',
            userId,
            timestamp: Date.now()
          }));
          return;
        }
        
        // For all other messages, user must be authenticated
        if (!userId) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Authentication required',
            timestamp: Date.now()
          }));
          return;
        }
        
        // Process message based on type
        processMessage(message, userId, ws);
        
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
          timestamp: Date.now()
        }));
      }
    });
    
    ws.on('close', () => {
      if (userId) {
        console.log(`WebSocket connection closed for user ${userId}`);
        clients = clients.filter(client => client.userId !== userId);
      }
    });
  });
  
  return wss;
}

// Message processing logic
function processMessage(message: ServerMessage, senderId: string, senderWs: WebSocket) {
  // Set timestamp and message ID if needed
  message.timestamp = Date.now();
  
  if (message.type === 'message') {
    const chatMessage = message as ChatMessage;
    
    // Add sender ID and message ID if not provided
    chatMessage.senderId = chatMessage.senderId || senderId;
    chatMessage.id = chatMessage.id || randomUUID();
    
    // Forward message to all clients in the same room
    forwardToRoom(chatMessage.roomId, chatMessage);
    
    // Save to database would happen here in a real implementation
  } 
  else if (message.type === 'typing') {
    const typingMessage = message as TypingMessage;
    
    // Add sender ID if not provided
    typingMessage.senderId = typingMessage.senderId || senderId;
    
    // Forward typing indicator to all clients in the same room
    forwardToRoom(typingMessage.roomId, typingMessage);
  }
  else if (message.type === 'call') {
    const callMessage = message as CallMessage;
    
    // Add caller ID if not provided
    if (callMessage.action === 'start') {
      callMessage.callerId = callMessage.callerId || senderId;
    }
    
    // Forward call signal to the specific recipient
    const recipientWs = clients.find(client => client.userId === callMessage.recipientId)?.connection;
    if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
      recipientWs.send(JSON.stringify(callMessage));
    } else {
      // If recipient is not connected, send error back to caller
      senderWs.send(JSON.stringify({
        type: 'error',
        message: 'Recipient is not online',
        relatedTo: callMessage,
        timestamp: Date.now()
      }));
    }
  }
  else if (message.type === 'read_receipt') {
    const readReceiptMessage = message as ReadReceiptMessage;
    
    // Add reader ID if not provided
    readReceiptMessage.readerId = readReceiptMessage.readerId || senderId;
    
    // Forward read receipt to all clients in the same room
    forwardToRoom(readReceiptMessage.roomId, readReceiptMessage);
    
    // Update read status in database would happen here in a real implementation
  }
}

// Helper to forward messages to all clients in a room
function forwardToRoom(roomId: string, message: ServerMessage) {
  // In a real app, you would query which users are in the room
  // For now, we broadcast to all connected clients as a simple implementation
  const messageStr = JSON.stringify(message);
  
  clients.forEach(client => {
    if (client.connection.readyState === WebSocket.OPEN) {
      client.connection.send(messageStr);
    }
  });
}