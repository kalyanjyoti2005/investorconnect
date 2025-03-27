import { 
  users, startups, investments, milestones, ndas, messages, events, eventParticipants, votes, notifications,
  type User, type Startup, type Investment, type Milestone, type Nda, type Message, type Event, type EventParticipant, type Vote, type Notification,
  type InsertUser, type InsertStartup, type InsertInvestment, type InsertMilestone, type InsertNda, type InsertMessage, type InsertEvent, type InsertEventParticipant, type InsertVote, type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pkg from 'pg';
const { Pool } = pkg;
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Initialize PostgreSQL session store
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    } as any);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  // Startup methods
  async getStartup(id: number): Promise<Startup | undefined> {
    const [startup] = await db.select().from(startups).where(eq(startups.id, id));
    return startup;
  }
  
  async getStartupsByFounderId(founderId: number): Promise<Startup[]> {
    return await db.select().from(startups).where(eq(startups.founderId, founderId));
  }
  
  async getAllStartups(): Promise<Startup[]> {
    return await db.select().from(startups);
  }
  
  async createStartup(startup: InsertStartup): Promise<Startup> {
    const [newStartup] = await db.insert(startups).values({
      ...startup,
      currentFunding: 0,
      trendingScore: 0
    }).returning();
    return newStartup;
  }
  
  async updateStartup(id: number, startupUpdate: Partial<Startup>): Promise<Startup | undefined> {
    const [updatedStartup] = await db.update(startups)
      .set(startupUpdate)
      .where(eq(startups.id, id))
      .returning();
    return updatedStartup;
  }
  
  // Investment methods
  async getInvestment(id: number): Promise<Investment | undefined> {
    const [investment] = await db.select().from(investments).where(eq(investments.id, id));
    return investment;
  }
  
  async getInvestmentsByInvestorId(investorId: number): Promise<Investment[]> {
    return await db.select().from(investments).where(eq(investments.investorId, investorId));
  }
  
  async getInvestmentsByStartupId(startupId: number): Promise<Investment[]> {
    return await db.select().from(investments).where(eq(investments.startupId, startupId));
  }
  
  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [newInvestment] = await db.insert(investments).values(investment).returning();
    
    // Update startup's currentFunding if investment is approved or released
    if (newInvestment.status === 'approved' || newInvestment.status === 'released') {
      const startup = await this.getStartup(investment.startupId);
      if (startup) {
        await this.updateStartup(startup.id, { 
          currentFunding: (startup.currentFunding || 0) + investment.amount 
        });
      }
    }
    
    return newInvestment;
  }
  
  async updateInvestmentStatus(id: number, status: string): Promise<Investment | undefined> {
    const investment = await this.getInvestment(id);
    if (!investment) return undefined;
    
    const [updatedInvestment] = await db.update(investments)
      .set({ status: status as any })
      .where(eq(investments.id, id))
      .returning();
    
    // Update startup's current funding if status changed to approved or released
    if (status === 'approved' || status === 'released') {
      const startup = await this.getStartup(updatedInvestment.startupId);
      if (startup && (investment.status !== 'approved' && investment.status !== 'released')) {
        await this.updateStartup(startup.id, { 
          currentFunding: (startup.currentFunding || 0) + investment.amount 
        });
      }
    }
    
    return updatedInvestment;
  }
  
  // Milestone methods
  async getMilestone(id: number): Promise<Milestone | undefined> {
    const [milestone] = await db.select().from(milestones).where(eq(milestones.id, id));
    return milestone;
  }
  
  async getMilestonesByStartupId(startupId: number): Promise<Milestone[]> {
    return await db.select().from(milestones).where(eq(milestones.startupId, startupId));
  }
  
  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const [newMilestone] = await db.insert(milestones).values({
      ...milestone,
      completed: false,
      completedAt: null
    }).returning();
    return newMilestone;
  }
  
  async completeMilestone(id: number): Promise<Milestone | undefined> {
    const now = new Date();
    const [updatedMilestone] = await db.update(milestones)
      .set({ 
        completed: true,
        completedAt: now
      })
      .where(eq(milestones.id, id))
      .returning();
    return updatedMilestone;
  }
  
  // NDA methods
  async getNda(id: number): Promise<Nda | undefined> {
    const [nda] = await db.select().from(ndas).where(eq(ndas.id, id));
    return nda;
  }
  
  async getNdaByInvestorAndStartup(investorId: number, startupId: number): Promise<Nda | undefined> {
    const [nda] = await db.select().from(ndas).where(
      and(
        eq(ndas.investorId, investorId),
        eq(ndas.startupId, startupId)
      )
    );
    return nda;
  }
  
  async getNdasByStartupId(startupId: number): Promise<Nda[]> {
    return await db.select().from(ndas).where(eq(ndas.startupId, startupId));
  }
  
  async createNda(nda: InsertNda): Promise<Nda> {
    const [newNda] = await db.insert(ndas).values({
      ...nda,
      signed: false,
      signedAt: null
    }).returning();
    return newNda;
  }
  
  async signNda(id: number): Promise<Nda | undefined> {
    const now = new Date();
    const [updatedNda] = await db.update(ndas)
      .set({ 
        signed: true,
        signedAt: now
      })
      .where(eq(ndas.id, id))
      .returning();
    return updatedNda;
  }
  
  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }
  
  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, user1Id),
            eq(messages.receiverId, user2Id)
          ),
          and(
            eq(messages.senderId, user2Id),
            eq(messages.receiverId, user1Id)
          )
        )
      )
      .orderBy(asc(messages.createdAt));
  }
  
  async getUserMessages(userId: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      )
      .orderBy(desc(messages.createdAt)); // Sort by newest first
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values({
      ...message,
      status: 'unread'
    }).returning();
    return newMessage;
  }
  
  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [updatedMessage] = await db.update(messages)
      .set({ status: 'read' })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }
  
  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }
  
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(asc(events.startTime));
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }
  
  // Event participant methods
  async getEventParticipantsByEventId(eventId: number): Promise<EventParticipant[]> {
    return await db.select().from(eventParticipants).where(eq(eventParticipants.eventId, eventId));
  }
  
  async getEventParticipantsByUserId(userId: number): Promise<EventParticipant[]> {
    return await db.select().from(eventParticipants).where(eq(eventParticipants.userId, userId));
  }
  
  async createEventParticipant(eventParticipant: InsertEventParticipant): Promise<EventParticipant> {
    const [newEventParticipant] = await db.insert(eventParticipants).values(eventParticipant).returning();
    return newEventParticipant;
  }
  
  // Vote methods
  async getVote(id: number): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes).where(eq(votes.id, id));
    return vote;
  }
  
  async getVoteByInvestorAndStartup(investorId: number, startupId: number): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes).where(
      and(
        eq(votes.investorId, investorId),
        eq(votes.startupId, startupId)
      )
    );
    return vote;
  }
  
  async getVotesByStartupId(startupId: number): Promise<Vote[]> {
    return await db.select().from(votes).where(eq(votes.startupId, startupId));
  }
  
  async createVote(vote: InsertVote): Promise<Vote> {
    const [newVote] = await db.insert(votes).values(vote).returning();
    
    // Update startup's trending score
    const startup = await this.getStartup(vote.startupId);
    if (startup) {
      const allVotes = await this.getVotesByStartupId(vote.startupId);
      const trendingScore = allVotes.reduce((sum, v) => sum + v.voteType, 0);
      await this.updateStartup(startup.id, { trendingScore });
    }
    
    return newVote;
  }
  
  async updateVote(id: number, voteType: number): Promise<Vote | undefined> {
    const vote = await this.getVote(id);
    if (!vote) return undefined;
    
    const [updatedVote] = await db.update(votes)
      .set({ voteType })
      .where(eq(votes.id, id))
      .returning();
    
    // Update startup's trending score
    const startup = await this.getStartup(vote.startupId);
    if (startup) {
      const allVotes = await this.getVotesByStartupId(vote.startupId);
      const trendingScore = allVotes.reduce((sum, v) => sum + v.voteType, 0);
      await this.updateStartup(startup.id, { trendingScore });
    }
    
    return updatedVote;
  }
  
  // Notification methods
  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification;
  }
  
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt)); // Sort by newest first
  }
  
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values({
      ...notification,
      read: false
    }).returning();
    return newNotification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }
}