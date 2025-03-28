import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import { storage } from './storage';
import { User } from '@shared/schema';

// Store active connections
interface Connection {
  ws: WebSocket;
  userId: string;
}

// Connection management
const connections: Map<string, Connection> = new Map();
const userRooms: Map<string, Set<string>> = new Map();
const roomUsers: Map<string, Set<string>> = new Map();

// Message Types
interface BaseMessage {
  id: string;
  timestamp: Date;
  type: string;
}

interface ChatMessage extends BaseMessage {
  type: 'message';
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
  candidates?: any[];
}

interface ReadReceiptMessage extends BaseMessage {
  type: 'read_receipt';
  roomId: string;
  messageIds: string[];
  readerId: string;
}

interface AuthMessage {
  type: 'auth';
  userId: string;
}

interface ErrorMessage {
  type: 'error';
  message: string;
  timestamp: number;
}

// Initialize WebSocket server
export function setupWebSocketServer(server: HttpServer): void {
  console.log('Setting up WebSocket server...');
  
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    
    let userId: string | null = null;
    
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Handle authentication first
        if (data.type === 'auth') {
          userId = data.userId;
          
          // Make sure userId is not null before proceeding
          if (userId) {
            // Store connection
            connections.set(userId, { ws, userId });
            
            // Create empty sets for new users
            if (!userRooms.has(userId)) {
              userRooms.set(userId, new Set());
            }
            
            // Send authentication success
            ws.send(JSON.stringify({
              type: 'auth_success',
              userId,
              timestamp: new Date()
            }));
            
            // Load user's chat rooms
            const userRoomList = await getUserRooms(userId);
            for (const room of userRoomList) {
              // Add user to room
              addUserToRoom(userId, room.id);
              
              // Send room data
              ws.send(JSON.stringify({
                type: 'room_data',
                roomId: room.id,
                name: room.name,
                participants: room.participants,
                timestamp: new Date()
              }));
              
              // Load messages for the room
              const messages = await getRoomMessages(room.id);
              if (messages.length > 0) {
                ws.send(JSON.stringify({
                  type: 'message_history',
                  roomId: room.id,
                  messages,
                  timestamp: new Date()
                }));
              }
            }
            
            console.log(`User ${userId} authenticated`);
            return;
          }
        }
        
        // Ensure user is authenticated for all other message types
        if (!userId) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Not authenticated',
            timestamp: Date.now()
          }));
          return;
        }
        
        // Process message based on type
        switch (data.type) {
          case 'message':
            handleChatMessage(userId, data);
            break;
            
          case 'typing':
            handleTypingMessage(userId, data);
            break;
            
          case 'call':
            handleCallMessage(userId, data);
            break;
            
          case 'read_receipt':
            handleReadReceipt(userId, data);
            break;
            
          default:
            console.log('Unknown message type:', data.type);
        }
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
      console.log('WebSocket connection closed', userId);
      
      if (userId) {
        // Clean up user's rooms
        const userRoomSet = userRooms.get(userId);
        if (userRoomSet) {
          // Use Array.from to convert Set to Array to avoid iteration issues
          Array.from(userRoomSet).forEach(roomId => {
            removeUserFromRoom(userId as string, roomId);
          });
        }
        
        // Remove user connection
        connections.delete(userId);
        userRooms.delete(userId);
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  console.log('WebSocket server initialized on path: /ws');
}

// Helper function to add user to room
function addUserToRoom(userId: string, roomId: string): void {
  // Add room to user's rooms
  const userRoomSet = userRooms.get(userId) || new Set();
  userRoomSet.add(roomId);
  userRooms.set(userId, userRoomSet);
  
  // Add user to room's users
  const roomUserSet = roomUsers.get(roomId) || new Set();
  roomUserSet.add(userId);
  roomUsers.set(roomId, roomUserSet);
}

// Helper function to remove user from room
function removeUserFromRoom(userId: string, roomId: string): void {
  // Remove room from user's rooms
  const userRoomSet = userRooms.get(userId);
  if (userRoomSet) {
    userRoomSet.delete(roomId);
  }
  
  // Remove user from room's users
  const roomUserSet = roomUsers.get(roomId);
  if (roomUserSet) {
    roomUserSet.delete(userId);
    
    // If room is empty, clean it up
    if (roomUserSet.size === 0) {
      roomUsers.delete(roomId);
    }
  }
}

// Function to broadcast message to all users in a room
function broadcastToRoom(roomId: string, message: any, excludeUserId?: string): void {
  const roomUserSet = roomUsers.get(roomId);
  if (!roomUserSet) return;
  
  // Use Array.from to convert Set to Array to avoid iteration issues
  Array.from(roomUserSet).forEach(userId => {
    if (excludeUserId && userId === excludeUserId) return;
    
    const connection = connections.get(userId);
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify(message));
    }
  });
}

// Function to send message to specific user
function sendToUser(userId: string, message: any): void {
  const connection = connections.get(userId);
  if (connection && connection.ws.readyState === WebSocket.OPEN) {
    connection.ws.send(JSON.stringify(message));
  }
}

// Handle chat message
async function handleChatMessage(userId: string, data: ChatMessage): Promise<void> {
  // Save message to database
  try {
    // Store message in the database
    // This is a placeholder - in a real app, we would save to the DB
    console.log('Storing message:', data);
    
    // Broadcast message to room
    broadcastToRoom(data.roomId, data);
  } catch (error) {
    console.error('Error handling chat message:', error);
    
    // Send error to sender
    sendToUser(userId, {
      type: 'error',
      message: 'Failed to send message',
      timestamp: Date.now()
    });
  }
}

// Handle typing message
function handleTypingMessage(userId: string, data: TypingMessage): void {
  broadcastToRoom(data.roomId, data, userId);
}

// Handle call message
function handleCallMessage(userId: string, data: CallMessage): void {
  if (data.action === 'start') {
    // Send to recipient
    sendToUser(data.recipientId, data);
  } else {
    // For answer/reject/end, send to both parties
    sendToUser(data.callerId, data);
    sendToUser(data.recipientId, data);
  }
}

// Handle read receipt
function handleReadReceipt(userId: string, data: ReadReceiptMessage): void {
  broadcastToRoom(data.roomId, data);
}

// Get user's chat rooms
async function getUserRooms(userId: string): Promise<any[]> {
  try {
    // In a real app, this would fetch from the database
    // For now, return sample data
    return [
      {
        id: `room_${Date.now()}`,
        name: 'Sample Room',
        type: 'one-on-one',
        participants: [userId, '2'],
      }
    ];
  } catch (error) {
    console.error('Error fetching user rooms:', error);
    return [];
  }
}

// Get messages for a room
async function getRoomMessages(roomId: string): Promise<ChatMessage[]> {
  try {
    // In a real app, this would fetch from the database
    return [];
  } catch (error) {
    console.error('Error fetching room messages:', error);
    return [];
  }
}

// Create a new room
export async function createChatRoom(name: string, type: string, participants: string[]): Promise<string> {
  const roomId = `room_${Date.now()}`;
  
  // Add all participants to the room
  for (const userId of participants) {
    addUserToRoom(userId, roomId);
  }
  
  // Notify all participants
  const roomData = {
    type: 'room_created',
    roomId,
    name,
    roomType: type,
    participants,
    timestamp: new Date()
  };
  
  for (const userId of participants) {
    sendToUser(userId, roomData);
  }
  
  return roomId;
}

// Send system message to a room
export function sendSystemMessage(roomId: string, text: string): void {
  const message: ChatMessage = {
    id: `system_${Date.now()}`,
    type: 'message',
    roomId,
    senderId: 'system',
    senderName: 'System',
    text,
    isRead: false,
    timestamp: new Date()
  };
  
  broadcastToRoom(roomId, message);
}