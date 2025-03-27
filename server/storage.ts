import {
  users, startups, investments, milestones, ndas, messages, events, eventParticipants, votes, notifications,
  type User, type Startup, type Investment, type Milestone, type Nda, type Message, type Event, type EventParticipant, type Vote, type Notification,
  type InsertUser, type InsertStartup, type InsertInvestment, type InsertMilestone, type InsertNda, type InsertMessage, type InsertEvent, type InsertEventParticipant, type InsertVote, type InsertNotification
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Startup methods
  getStartup(id: number): Promise<Startup | undefined>;
  getStartupsByFounderId(founderId: number): Promise<Startup[]>;
  getAllStartups(): Promise<Startup[]>;
  createStartup(startup: InsertStartup): Promise<Startup>;
  updateStartup(id: number, startup: Partial<Startup>): Promise<Startup | undefined>;
  
  // Investment methods
  getInvestment(id: number): Promise<Investment | undefined>;
  getInvestmentsByInvestorId(investorId: number): Promise<Investment[]>;
  getInvestmentsByStartupId(startupId: number): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestmentStatus(id: number, status: string): Promise<Investment | undefined>;
  
  // Milestone methods
  getMilestone(id: number): Promise<Milestone | undefined>;
  getMilestonesByStartupId(startupId: number): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  completeMilestone(id: number): Promise<Milestone | undefined>;
  
  // NDA methods
  getNda(id: number): Promise<Nda | undefined>;
  getNdaByInvestorAndStartup(investorId: number, startupId: number): Promise<Nda | undefined>;
  getNdasByStartupId(startupId: number): Promise<Nda[]>;
  createNda(nda: InsertNda): Promise<Nda>;
  signNda(id: number): Promise<Nda | undefined>;
  
  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getUserMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Event methods
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Event participant methods
  getEventParticipantsByEventId(eventId: number): Promise<EventParticipant[]>;
  getEventParticipantsByUserId(userId: number): Promise<EventParticipant[]>;
  createEventParticipant(eventParticipant: InsertEventParticipant): Promise<EventParticipant>;
  
  // Vote methods
  getVote(id: number): Promise<Vote | undefined>;
  getVoteByInvestorAndStartup(investorId: number, startupId: number): Promise<Vote | undefined>;
  getVotesByStartupId(startupId: number): Promise<Vote[]>;
  createVote(vote: InsertVote): Promise<Vote>;
  updateVote(id: number, voteType: number): Promise<Vote | undefined>;
  
  // Notification methods
  getNotification(id: number): Promise<Notification | undefined>;
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private startupsMap: Map<number, Startup>;
  private investmentsMap: Map<number, Investment>;
  private milestonesMap: Map<number, Milestone>;
  private ndasMap: Map<number, Nda>;
  private messagesMap: Map<number, Message>;
  private eventsMap: Map<number, Event>;
  private eventParticipantsMap: Map<number, EventParticipant>;
  private votesMap: Map<number, Vote>;
  private notificationsMap: Map<number, Notification>;

  sessionStore: session.SessionStore;
  
  private userIdCounter: number = 1;
  private startupIdCounter: number = 1;
  private investmentIdCounter: number = 1;
  private milestoneIdCounter: number = 1;
  private ndaIdCounter: number = 1;
  private messageIdCounter: number = 1;
  private eventIdCounter: number = 1;
  private eventParticipantIdCounter: number = 1;
  private voteIdCounter: number = 1;
  private notificationIdCounter: number = 1;

  constructor() {
    this.usersMap = new Map();
    this.startupsMap = new Map();
    this.investmentsMap = new Map();
    this.milestonesMap = new Map();
    this.ndasMap = new Map();
    this.messagesMap = new Map();
    this.eventsMap = new Map();
    this.eventParticipantsMap = new Map();
    this.votesMap = new Map();
    this.notificationsMap = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const newUser: User = { ...user, id, createdAt: now };
    this.usersMap.set(id, newUser);
    return newUser;
  }

  // Startup methods
  async getStartup(id: number): Promise<Startup | undefined> {
    return this.startupsMap.get(id);
  }

  async getStartupsByFounderId(founderId: number): Promise<Startup[]> {
    return Array.from(this.startupsMap.values()).filter(
      (startup) => startup.founderId === founderId,
    );
  }

  async getAllStartups(): Promise<Startup[]> {
    return Array.from(this.startupsMap.values());
  }

  async createStartup(startup: InsertStartup): Promise<Startup> {
    const id = this.startupIdCounter++;
    const now = new Date();
    const newStartup: Startup = { 
      ...startup, 
      id, 
      createdAt: now, 
      currentFunding: 0,
      trendingScore: 0 
    };
    this.startupsMap.set(id, newStartup);
    return newStartup;
  }

  async updateStartup(id: number, startupUpdate: Partial<Startup>): Promise<Startup | undefined> {
    const startup = await this.getStartup(id);
    if (!startup) return undefined;
    
    const updatedStartup = { ...startup, ...startupUpdate };
    this.startupsMap.set(id, updatedStartup);
    return updatedStartup;
  }

  // Investment methods
  async getInvestment(id: number): Promise<Investment | undefined> {
    return this.investmentsMap.get(id);
  }

  async getInvestmentsByInvestorId(investorId: number): Promise<Investment[]> {
    return Array.from(this.investmentsMap.values()).filter(
      (investment) => investment.investorId === investorId,
    );
  }

  async getInvestmentsByStartupId(startupId: number): Promise<Investment[]> {
    return Array.from(this.investmentsMap.values()).filter(
      (investment) => investment.startupId === startupId,
    );
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const id = this.investmentIdCounter++;
    const now = new Date();
    const newInvestment: Investment = { ...investment, id, createdAt: now };
    this.investmentsMap.set(id, newInvestment);
    
    // Update startup's current funding if investment is approved or released
    if (newInvestment.status === 'approved' || newInvestment.status === 'released') {
      const startup = await this.getStartup(newInvestment.startupId);
      if (startup) {
        await this.updateStartup(startup.id, { 
          currentFunding: startup.currentFunding + newInvestment.amount 
        });
      }
    }
    
    return newInvestment;
  }

  async updateInvestmentStatus(id: number, status: string): Promise<Investment | undefined> {
    const investment = await this.getInvestment(id);
    if (!investment) return undefined;
    
    const updatedInvestment = { ...investment, status: status as any };
    this.investmentsMap.set(id, updatedInvestment);
    
    // Update startup's current funding if status changed to approved or released
    if (status === 'approved' || status === 'released') {
      const startup = await this.getStartup(updatedInvestment.startupId);
      if (startup && (investment.status !== 'approved' && investment.status !== 'released')) {
        await this.updateStartup(startup.id, { 
          currentFunding: startup.currentFunding + investment.amount 
        });
      }
    }
    
    return updatedInvestment;
  }

  // Milestone methods
  async getMilestone(id: number): Promise<Milestone | undefined> {
    return this.milestonesMap.get(id);
  }

  async getMilestonesByStartupId(startupId: number): Promise<Milestone[]> {
    return Array.from(this.milestonesMap.values()).filter(
      (milestone) => milestone.startupId === startupId,
    );
  }

  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const id = this.milestoneIdCounter++;
    const now = new Date();
    const newMilestone: Milestone = { 
      ...milestone, 
      id, 
      createdAt: now, 
      completed: false, 
      completedAt: null 
    };
    this.milestonesMap.set(id, newMilestone);
    return newMilestone;
  }

  async completeMilestone(id: number): Promise<Milestone | undefined> {
    const milestone = await this.getMilestone(id);
    if (!milestone) return undefined;
    
    const now = new Date();
    const updatedMilestone = { ...milestone, completed: true, completedAt: now };
    this.milestonesMap.set(id, updatedMilestone);
    return updatedMilestone;
  }

  // NDA methods
  async getNda(id: number): Promise<Nda | undefined> {
    return this.ndasMap.get(id);
  }

  async getNdaByInvestorAndStartup(investorId: number, startupId: number): Promise<Nda | undefined> {
    return Array.from(this.ndasMap.values()).find(
      (nda) => nda.investorId === investorId && nda.startupId === startupId,
    );
  }

  async getNdasByStartupId(startupId: number): Promise<Nda[]> {
    return Array.from(this.ndasMap.values()).filter(
      (nda) => nda.startupId === startupId,
    );
  }

  async createNda(nda: InsertNda): Promise<Nda> {
    const id = this.ndaIdCounter++;
    const now = new Date();
    const newNda: Nda = { 
      ...nda, 
      id, 
      createdAt: now, 
      signed: false, 
      signedAt: null 
    };
    this.ndasMap.set(id, newNda);
    return newNda;
  }

  async signNda(id: number): Promise<Nda | undefined> {
    const nda = await this.getNda(id);
    if (!nda) return undefined;
    
    const now = new Date();
    const updatedNda = { ...nda, signed: true, signedAt: now };
    this.ndasMap.set(id, updatedNda);
    return updatedNda;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messagesMap.get(id);
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messagesMap.values()).filter(
      (message) => (
        (message.senderId === user1Id && message.receiverId === user2Id) ||
        (message.senderId === user2Id && message.receiverId === user1Id)
      ),
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messagesMap.values()).filter(
      (message) => message.senderId === userId || message.receiverId === userId,
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const newMessage: Message = { ...message, id, createdAt: now, status: 'unread' };
    this.messagesMap.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = await this.getMessage(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, status: 'read' as const };
    this.messagesMap.set(id, updatedMessage);
    return updatedMessage;
  }

  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    return this.eventsMap.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.eventsMap.values()).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const now = new Date();
    const newEvent: Event = { ...event, id, createdAt: now };
    this.eventsMap.set(id, newEvent);
    return newEvent;
  }

  // Event participant methods
  async getEventParticipantsByEventId(eventId: number): Promise<EventParticipant[]> {
    return Array.from(this.eventParticipantsMap.values()).filter(
      (participant) => participant.eventId === eventId,
    );
  }

  async getEventParticipantsByUserId(userId: number): Promise<EventParticipant[]> {
    return Array.from(this.eventParticipantsMap.values()).filter(
      (participant) => participant.userId === userId,
    );
  }

  async createEventParticipant(eventParticipant: InsertEventParticipant): Promise<EventParticipant> {
    const id = this.eventParticipantIdCounter++;
    const now = new Date();
    const newEventParticipant: EventParticipant = { ...eventParticipant, id, createdAt: now };
    this.eventParticipantsMap.set(id, newEventParticipant);
    return newEventParticipant;
  }

  // Vote methods
  async getVote(id: number): Promise<Vote | undefined> {
    return this.votesMap.get(id);
  }

  async getVoteByInvestorAndStartup(investorId: number, startupId: number): Promise<Vote | undefined> {
    return Array.from(this.votesMap.values()).find(
      (vote) => vote.investorId === investorId && vote.startupId === startupId,
    );
  }

  async getVotesByStartupId(startupId: number): Promise<Vote[]> {
    return Array.from(this.votesMap.values()).filter(
      (vote) => vote.startupId === startupId,
    );
  }

  async createVote(vote: InsertVote): Promise<Vote> {
    const id = this.voteIdCounter++;
    const now = new Date();
    const newVote: Vote = { ...vote, id, createdAt: now };
    this.votesMap.set(id, newVote);
    
    // Update startup's trending score
    const startup = await this.getStartup(vote.startupId);
    if (startup) {
      const votes = await this.getVotesByStartupId(vote.startupId);
      const trendingScore = votes.reduce((sum, v) => sum + v.voteType, 0);
      await this.updateStartup(startup.id, { trendingScore });
    }
    
    return newVote;
  }

  async updateVote(id: number, voteType: number): Promise<Vote | undefined> {
    const vote = await this.getVote(id);
    if (!vote) return undefined;
    
    const updatedVote = { ...vote, voteType };
    this.votesMap.set(id, updatedVote);
    
    // Update startup's trending score
    const startup = await this.getStartup(vote.startupId);
    if (startup) {
      const votes = await this.getVotesByStartupId(vote.startupId);
      const trendingScore = votes.reduce((sum, v) => sum + v.voteType, 0);
      await this.updateStartup(startup.id, { trendingScore });
    }
    
    return updatedVote;
  }

  // Notification methods
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notificationsMap.get(id);
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notificationsMap.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    const newNotification: Notification = { ...notification, id, createdAt: now, read: false };
    this.notificationsMap.set(id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = await this.getNotification(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, read: true };
    this.notificationsMap.set(id, updatedNotification);
    return updatedNotification;
  }
}

export const storage = new MemStorage();
