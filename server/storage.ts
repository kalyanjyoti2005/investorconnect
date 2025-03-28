import {
  users, startups, investments, milestones, ndas, messages, events, eventParticipants, votes, notifications,
  discussions, discussionComments, discussionVotes, hackathonTeams, hackathonTeamMembers, hackathonChatMessages, badges,
  coffeeAvailability, coffeePreferences, coffeeMeetings,
  type User, type Startup, type Investment, type Milestone, type Nda, type Message, type Event, type EventParticipant, type Vote, type Notification,
  type Discussion, type DiscussionComment, type DiscussionVote, type HackathonTeam, type HackathonTeamMember, type HackathonChatMessage, type Badge,
  type CoffeeAvailability, type CoffeePreference, type CoffeeMeeting,
  type InsertUser, type InsertStartup, type InsertInvestment, type InsertMilestone, type InsertNda, type InsertMessage, type InsertEvent, type InsertEventParticipant, type InsertVote, type InsertNotification,
  type InsertDiscussion, type InsertDiscussionComment, type InsertDiscussionVote, type InsertHackathonTeam, type InsertHackathonTeamMember, type InsertHackathonChatMessage, type InsertBadge,
  type InsertCoffeeAvailability, type InsertCoffeePreference, type InsertCoffeeMeeting
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
  
  // Discussion methods
  getDiscussion(id: number): Promise<Discussion | undefined>;
  getAllDiscussions(): Promise<Discussion[]>;
  getDiscussionsByTag(tag: string): Promise<Discussion[]>;
  getDiscussionsByAuthor(authorId: number): Promise<Discussion[]>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  pinDiscussion(id: number): Promise<Discussion | undefined>;
  verifyDiscussion(id: number): Promise<Discussion | undefined>;
  
  // Discussion comment methods
  getDiscussionComment(id: number): Promise<DiscussionComment | undefined>;
  getCommentsByDiscussionId(discussionId: number): Promise<DiscussionComment[]>;
  createDiscussionComment(comment: InsertDiscussionComment): Promise<DiscussionComment>;
  verifyDiscussionComment(id: number): Promise<DiscussionComment | undefined>;
  
  // Discussion vote methods
  getDiscussionVote(id: number): Promise<DiscussionVote | undefined>;
  getDiscussionVoteByUserAndDiscussion(userId: number, discussionId: number): Promise<DiscussionVote | undefined>;
  getDiscussionVoteByUserAndComment(userId: number, commentId: number): Promise<DiscussionVote | undefined>;
  createDiscussionVote(vote: InsertDiscussionVote): Promise<DiscussionVote>;
  updateDiscussionVote(id: number, voteType: number): Promise<DiscussionVote | undefined>;
  
  // Hackathon team methods
  getHackathonTeam(id: number): Promise<HackathonTeam | undefined>;
  getAllHackathonTeams(): Promise<HackathonTeam[]>;
  createHackathonTeam(team: InsertHackathonTeam): Promise<HackathonTeam>;
  
  // Hackathon team member methods
  getHackathonTeamMember(id: number): Promise<HackathonTeamMember | undefined>;
  getHackathonTeamMembersByTeamId(teamId: number): Promise<HackathonTeamMember[]>;
  getHackathonTeamMembersByUserId(userId: number): Promise<HackathonTeamMember[]>;
  createHackathonTeamMember(member: InsertHackathonTeamMember): Promise<HackathonTeamMember>;
  makeTeamLeader(id: number): Promise<HackathonTeamMember | undefined>;
  removeHackathonTeamMember(userId: number, teamId: number): Promise<void>;
  
  // Hackathon chat message methods
  getHackathonChatMessage(id: number): Promise<HackathonChatMessage | undefined>;
  getHackathonChatMessagesByTeamId(teamId: number): Promise<HackathonChatMessage[]>;
  createHackathonChatMessage(message: InsertHackathonChatMessage): Promise<HackathonChatMessage>;
  
  // Badge methods
  getBadge(id: number): Promise<Badge | undefined>;
  getBadgesByUserId(userId: number): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // Coffee availability methods
  getCoffeeAvailability(id: number): Promise<CoffeeAvailability | undefined>;
  getCoffeeAvailabilitiesByUserId(userId: number): Promise<CoffeeAvailability[]>;
  createCoffeeAvailability(availability: InsertCoffeeAvailability): Promise<CoffeeAvailability>;
  updateCoffeeAvailability(id: number, availability: Partial<CoffeeAvailability>): Promise<CoffeeAvailability | undefined>;
  deleteCoffeeAvailability(id: number): Promise<void>;
  
  // Coffee preference methods
  getCoffeePreference(id: number): Promise<CoffeePreference | undefined>;
  getCoffeePreferenceByUserId(userId: number): Promise<CoffeePreference | undefined>;
  createCoffeePreference(preference: InsertCoffeePreference): Promise<CoffeePreference>;
  updateCoffeePreference(id: number, preference: Partial<CoffeePreference>): Promise<CoffeePreference | undefined>;
  
  // Coffee meeting methods
  getCoffeeMeeting(id: number): Promise<CoffeeMeeting | undefined>;
  getCoffeeMeetingsByUserId(userId: number): Promise<CoffeeMeeting[]>;
  getCoffeeMeetingsBetweenUsers(user1Id: number, user2Id: number): Promise<CoffeeMeeting[]>;
  createCoffeeMeeting(meeting: InsertCoffeeMeeting): Promise<CoffeeMeeting>;
  updateCoffeeMeetingStatus(id: number, status: string): Promise<CoffeeMeeting | undefined>;
  findMatchingUsers(userId: number, count?: number): Promise<{userId: number, matchScore: number, matchReason: string}[]>;
  
  // Session store
  sessionStore: session.Store;
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
  
  // Community-related maps
  private discussionsMap: Map<number, Discussion>;
  private discussionCommentsMap: Map<number, DiscussionComment>;
  private discussionVotesMap: Map<number, DiscussionVote>;
  private hackathonTeamsMap: Map<number, HackathonTeam>;
  private hackathonTeamMembersMap: Map<number, HackathonTeamMember>;
  private hackathonChatMessagesMap: Map<number, HackathonChatMessage>;
  private badgesMap: Map<number, Badge>;
  
  // Coffee chat related maps
  private coffeeAvailabilityMap: Map<number, CoffeeAvailability>;
  private coffeePreferenceMap: Map<number, CoffeePreference>;
  private coffeeMeetingMap: Map<number, CoffeeMeeting>;

  sessionStore: session.Store;
  
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
  
  // Community-related counters
  private discussionIdCounter: number = 1;
  private discussionCommentIdCounter: number = 1;
  private discussionVoteIdCounter: number = 1;
  private hackathonTeamIdCounter: number = 1;
  private hackathonTeamMemberIdCounter: number = 1;
  private hackathonChatMessageIdCounter: number = 1;
  private badgeIdCounter: number = 1;
  
  // Coffee chat related counters
  private coffeeAvailabilityIdCounter: number = 1;
  private coffeePreferenceIdCounter: number = 1;
  private coffeeMeetingIdCounter: number = 1;

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
    
    // Initialize community-related maps
    this.discussionsMap = new Map();
    this.discussionCommentsMap = new Map();
    this.discussionVotesMap = new Map();
    this.hackathonTeamsMap = new Map();
    this.hackathonTeamMembersMap = new Map();
    this.hackathonChatMessagesMap = new Map();
    this.badgesMap = new Map();
    
    // Initialize coffee chat related maps
    this.coffeeAvailabilityMap = new Map();
    this.coffeePreferenceMap = new Map();
    this.coffeeMeetingMap = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }) as any;
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
    const newUser: User = { 
      ...user, 
      id, 
      createdAt: now,
      bio: user.bio || null,
      profileImage: user.profileImage || null 
    };
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
      trendingScore: 0,
      logo: startup.logo || null,
      businessPlan: startup.businessPlan || null,
      pitchDeck: startup.pitchDeck || null,
      website: startup.website || null
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
        const currentFunding = startup.currentFunding || 0;
        await this.updateStartup(startup.id, { 
          currentFunding: currentFunding + newInvestment.amount 
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
        const currentFunding = startup.currentFunding || 0;
        await this.updateStartup(startup.id, { 
          currentFunding: currentFunding + investment.amount 
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
      completedAt: null,
      dueDate: milestone.dueDate || null,
      fundingAmount: milestone.fundingAmount || null
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
    const newEvent: Event = { 
      ...event, 
      id, 
      createdAt: now,
      location: event.location || null
    };
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
    const newNotification: Notification = { 
      ...notification, 
      id, 
      createdAt: now, 
      read: false,
      relatedId: notification.relatedId || null
    };
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
  
  // Discussion methods
  async getDiscussion(id: number): Promise<Discussion | undefined> {
    return this.discussionsMap.get(id);
  }
  
  async getAllDiscussions(): Promise<Discussion[]> {
    return Array.from(this.discussionsMap.values())
      .sort((a, b) => {
        // Sort by pinned first, then by newest
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }
  
  async getDiscussionsByTag(tag: string): Promise<Discussion[]> {
    return Array.from(this.discussionsMap.values())
      .filter((discussion) => discussion.tag === tag)
      .sort((a, b) => {
        // Sort by pinned first, then by newest
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }
  
  async getDiscussionsByAuthor(authorId: number): Promise<Discussion[]> {
    return Array.from(this.discussionsMap.values())
      .filter((discussion) => discussion.authorId === authorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const id = this.discussionIdCounter++;
    const now = new Date();
    const newDiscussion: Discussion = {
      ...discussion,
      id,
      createdAt: now,
      isPinned: false,
      upvotes: 0,
      downvotes: 0,
      isVerified: false
    };
    this.discussionsMap.set(id, newDiscussion);
    return newDiscussion;
  }
  
  async pinDiscussion(id: number): Promise<Discussion | undefined> {
    const discussion = await this.getDiscussion(id);
    if (!discussion) return undefined;
    
    const updatedDiscussion = { ...discussion, isPinned: true };
    this.discussionsMap.set(id, updatedDiscussion);
    return updatedDiscussion;
  }
  
  async verifyDiscussion(id: number): Promise<Discussion | undefined> {
    const discussion = await this.getDiscussion(id);
    if (!discussion) return undefined;
    
    const updatedDiscussion = { ...discussion, isVerified: true };
    this.discussionsMap.set(id, updatedDiscussion);
    return updatedDiscussion;
  }
  
  // Discussion comment methods
  async getDiscussionComment(id: number): Promise<DiscussionComment | undefined> {
    return this.discussionCommentsMap.get(id);
  }
  
  async getCommentsByDiscussionId(discussionId: number): Promise<DiscussionComment[]> {
    return Array.from(this.discussionCommentsMap.values())
      .filter((comment) => comment.discussionId === discussionId)
      .sort((a, b) => {
        // Sort verified comments first, then by most upvotes, then by newest
        if (a.isVerified && !b.isVerified) return -1;
        if (!a.isVerified && b.isVerified) return 1;
        
        const aUpvotes = a.upvotes || 0;
        const aDownvotes = a.downvotes || 0;
        const bUpvotes = b.upvotes || 0;
        const bDownvotes = b.downvotes || 0;
        
        const aScore = aUpvotes - aDownvotes;
        const bScore = bUpvotes - bDownvotes;
        if (aScore !== bScore) return bScore - aScore;
        
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
  }
  
  async createDiscussionComment(comment: InsertDiscussionComment): Promise<DiscussionComment> {
    const id = this.discussionCommentIdCounter++;
    const now = new Date();
    const newComment: DiscussionComment = {
      ...comment,
      id,
      createdAt: now,
      upvotes: 0,
      downvotes: 0,
      isVerified: false
    };
    this.discussionCommentsMap.set(id, newComment);
    return newComment;
  }
  
  async verifyDiscussionComment(id: number): Promise<DiscussionComment | undefined> {
    const comment = await this.getDiscussionComment(id);
    if (!comment) return undefined;
    
    const updatedComment = { ...comment, isVerified: true };
    this.discussionCommentsMap.set(id, updatedComment);
    return updatedComment;
  }
  
  // Discussion vote methods
  async getDiscussionVote(id: number): Promise<DiscussionVote | undefined> {
    return this.discussionVotesMap.get(id);
  }
  
  async getDiscussionVoteByUserAndDiscussion(userId: number, discussionId: number): Promise<DiscussionVote | undefined> {
    return Array.from(this.discussionVotesMap.values()).find(
      (vote) => vote.userId === userId && vote.discussionId === discussionId && !vote.commentId
    );
  }
  
  async getDiscussionVoteByUserAndComment(userId: number, commentId: number): Promise<DiscussionVote | undefined> {
    return Array.from(this.discussionVotesMap.values()).find(
      (vote) => vote.userId === userId && vote.commentId === commentId
    );
  }
  
  async createDiscussionVote(vote: InsertDiscussionVote): Promise<DiscussionVote> {
    const id = this.discussionVoteIdCounter++;
    const now = new Date();
    const newVote: DiscussionVote = { 
      ...vote, 
      id, 
      createdAt: now,
      discussionId: vote.discussionId || null,
      commentId: vote.commentId || null
    };
    this.discussionVotesMap.set(id, newVote);
    
    // Update discussion or comment vote counts
    if (vote.discussionId && !vote.commentId) {
      const discussion = await this.getDiscussion(vote.discussionId);
      if (discussion) {
        const upvotes = discussion.upvotes || 0;
        const downvotes = discussion.downvotes || 0;
        const updatedDiscussion = { 
          ...discussion, 
          upvotes: vote.voteType > 0 ? upvotes + 1 : upvotes,
          downvotes: vote.voteType < 0 ? downvotes + 1 : downvotes
        };
        this.discussionsMap.set(discussion.id, updatedDiscussion);
      }
    } else if (vote.commentId) {
      const comment = await this.getDiscussionComment(vote.commentId);
      if (comment) {
        const upvotes = comment.upvotes || 0;
        const downvotes = comment.downvotes || 0;
        const updatedComment = { 
          ...comment, 
          upvotes: vote.voteType > 0 ? upvotes + 1 : upvotes,
          downvotes: vote.voteType < 0 ? downvotes + 1 : downvotes
        };
        this.discussionCommentsMap.set(comment.id, updatedComment);
      }
    }
    
    return newVote;
  }
  
  async updateDiscussionVote(id: number, voteType: number): Promise<DiscussionVote | undefined> {
    const vote = await this.getDiscussionVote(id);
    if (!vote) return undefined;
    
    const oldVoteType = vote.voteType;
    const updatedVote = { ...vote, voteType };
    this.discussionVotesMap.set(id, updatedVote);
    
    // Update discussion or comment vote counts
    if (vote.discussionId && !vote.commentId) {
      const discussion = await this.getDiscussion(vote.discussionId);
      if (discussion) {
        const upvotes = discussion.upvotes || 0;
        const downvotes = discussion.downvotes || 0;
        const updatedDiscussion = { 
          ...discussion, 
          upvotes: oldVoteType > 0 ? upvotes - 1 : voteType > 0 ? upvotes + 1 : upvotes,
          downvotes: oldVoteType < 0 ? downvotes - 1 : voteType < 0 ? downvotes + 1 : downvotes
        };
        this.discussionsMap.set(discussion.id, updatedDiscussion);
      }
    } else if (vote.commentId) {
      const comment = await this.getDiscussionComment(vote.commentId);
      if (comment) {
        const upvotes = comment.upvotes || 0;
        const downvotes = comment.downvotes || 0;
        const updatedComment = { 
          ...comment, 
          upvotes: oldVoteType > 0 ? upvotes - 1 : voteType > 0 ? upvotes + 1 : upvotes,
          downvotes: oldVoteType < 0 ? downvotes - 1 : voteType < 0 ? downvotes + 1 : downvotes
        };
        this.discussionCommentsMap.set(comment.id, updatedComment);
      }
    }
    
    return updatedVote;
  }
  
  // Hackathon team methods
  async getHackathonTeam(id: number): Promise<HackathonTeam | undefined> {
    return this.hackathonTeamsMap.get(id);
  }
  
  async getAllHackathonTeams(): Promise<HackathonTeam[]> {
    return Array.from(this.hackathonTeamsMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  
  async createHackathonTeam(team: InsertHackathonTeam): Promise<HackathonTeam> {
    const id = this.hackathonTeamIdCounter++;
    const now = new Date();
    const newTeam: HackathonTeam = { 
      ...team, 
      id, 
      createdAt: now,
      logoUrl: team.logoUrl || null
    };
    this.hackathonTeamsMap.set(id, newTeam);
    return newTeam;
  }
  
  // Hackathon team member methods
  async getHackathonTeamMember(id: number): Promise<HackathonTeamMember | undefined> {
    return this.hackathonTeamMembersMap.get(id);
  }
  
  async getHackathonTeamMembersByTeamId(teamId: number): Promise<HackathonTeamMember[]> {
    return Array.from(this.hackathonTeamMembersMap.values())
      .filter((member) => member.teamId === teamId)
      .sort((a, b) => {
        // Sort leaders first, then by join date
        if (a.isLeader && !b.isLeader) return -1;
        if (!a.isLeader && b.isLeader) return 1;
        return a.joinedAt.getTime() - b.joinedAt.getTime();
      });
  }
  
  async getHackathonTeamMembersByUserId(userId: number): Promise<HackathonTeamMember[]> {
    return Array.from(this.hackathonTeamMembersMap.values())
      .filter((member) => member.userId === userId)
      .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime());
  }
  
  async createHackathonTeamMember(member: InsertHackathonTeamMember): Promise<HackathonTeamMember> {
    const id = this.hackathonTeamMemberIdCounter++;
    const now = new Date();
    const newMember: HackathonTeamMember = { 
      ...member, 
      id, 
      joinedAt: now, 
      isLeader: member.isLeader || false 
    };
    this.hackathonTeamMembersMap.set(id, newMember);
    return newMember;
  }
  
  async makeTeamLeader(id: number): Promise<HackathonTeamMember | undefined> {
    const member = await this.getHackathonTeamMember(id);
    if (!member) return undefined;
    
    // First, remove leader status from any existing team leader
    const teamMembers = await this.getHackathonTeamMembersByTeamId(member.teamId);
    const currentLeader = teamMembers.find((m) => m.isLeader);
    
    if (currentLeader && currentLeader.id !== id) {
      const updatedCurrentLeader = { ...currentLeader, isLeader: false };
      this.hackathonTeamMembersMap.set(currentLeader.id, updatedCurrentLeader);
    }
    
    // Set the new leader
    const updatedMember = { ...member, isLeader: true };
    this.hackathonTeamMembersMap.set(id, updatedMember);
    return updatedMember;
  }
  
  async removeHackathonTeamMember(userId: number, teamId: number): Promise<void> {
    // Find all members that match the criteria
    const members = Array.from(this.hackathonTeamMembersMap.values())
      .filter(member => member.userId === userId && member.teamId === teamId);
    
    // Remove all matched members
    for (const member of members) {
      this.hackathonTeamMembersMap.delete(member.id);
    }
  }
  
  // Hackathon chat message methods
  async getHackathonChatMessage(id: number): Promise<HackathonChatMessage | undefined> {
    return this.hackathonChatMessagesMap.get(id);
  }
  
  async getHackathonChatMessagesByTeamId(teamId: number): Promise<HackathonChatMessage[]> {
    return Array.from(this.hackathonChatMessagesMap.values())
      .filter((message) => message.teamId === teamId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async createHackathonChatMessage(message: InsertHackathonChatMessage): Promise<HackathonChatMessage> {
    const id = this.hackathonChatMessageIdCounter++;
    const now = new Date();
    const newMessage: HackathonChatMessage = { ...message, id, createdAt: now };
    this.hackathonChatMessagesMap.set(id, newMessage);
    return newMessage;
  }
  
  // Badge methods
  async getBadge(id: number): Promise<Badge | undefined> {
    return this.badgesMap.get(id);
  }
  
  async getBadgesByUserId(userId: number): Promise<Badge[]> {
    return Array.from(this.badgesMap.values())
      .filter((badge) => badge.userId === userId)
      .sort((a, b) => b.awardedAt.getTime() - a.awardedAt.getTime());
  }
  
  async createBadge(badge: InsertBadge): Promise<Badge> {
    const id = this.badgeIdCounter++;
    const now = new Date();
    const newBadge: Badge = { 
      ...badge, 
      id, 
      awardedAt: now,
      iconUrl: badge.iconUrl || null
    };
    this.badgesMap.set(id, newBadge);
    
    // Create a notification for the user
    await this.createNotification({
      userId: badge.userId,
      type: 'badge',
      content: `You've earned the "${badge.name}" badge!`,
      relatedId: id
    });
    
    return newBadge;
  }
  
  // Coffee availability methods
  async getCoffeeAvailability(id: number): Promise<CoffeeAvailability | undefined> {
    return this.coffeeAvailabilityMap.get(id);
  }
  
  async getCoffeeAvailabilitiesByUserId(userId: number): Promise<CoffeeAvailability[]> {
    return Array.from(this.coffeeAvailabilityMap.values())
      .filter(availability => availability.userId === userId)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
  
  async createCoffeeAvailability(availability: InsertCoffeeAvailability): Promise<CoffeeAvailability> {
    const id = this.coffeeAvailabilityIdCounter++;
    const now = new Date();
    const newAvailability: CoffeeAvailability = { 
      ...availability, 
      id, 
      createdAt: now,
      isRecurring: availability.isRecurring ?? true 
    };
    this.coffeeAvailabilityMap.set(id, newAvailability);
    return newAvailability;
  }
  
  async updateCoffeeAvailability(id: number, availabilityUpdate: Partial<CoffeeAvailability>): Promise<CoffeeAvailability | undefined> {
    const availability = await this.getCoffeeAvailability(id);
    if (!availability) return undefined;
    
    const updatedAvailability = { ...availability, ...availabilityUpdate };
    this.coffeeAvailabilityMap.set(id, updatedAvailability);
    return updatedAvailability;
  }
  
  async deleteCoffeeAvailability(id: number): Promise<void> {
    this.coffeeAvailabilityMap.delete(id);
  }
  
  // Coffee preference methods
  async getCoffeePreference(id: number): Promise<CoffeePreference | undefined> {
    return this.coffeePreferenceMap.get(id);
  }
  
  async getCoffeePreferenceByUserId(userId: number): Promise<CoffeePreference | undefined> {
    return Array.from(this.coffeePreferenceMap.values())
      .find(preference => preference.userId === userId);
  }
  
  async createCoffeePreference(preference: InsertCoffeePreference): Promise<CoffeePreference> {
    const id = this.coffeePreferenceIdCounter++;
    const now = new Date();
    const newPreference: CoffeePreference = { 
      ...preference, 
      id, 
      updatedAt: now,
      preferredTopics: preference.preferredTopics || null,
      preferredRoles: preference.preferredRoles || null,
      preferredIndustries: preference.preferredIndustries || null,
      bio: preference.bio || null,
      maxMeetingsPerWeek: preference.maxMeetingsPerWeek ?? 2,
      virtualOnly: preference.virtualOnly ?? true
    };
    this.coffeePreferenceMap.set(id, newPreference);
    return newPreference;
  }
  
  async updateCoffeePreference(id: number, preferenceUpdate: Partial<CoffeePreference>): Promise<CoffeePreference | undefined> {
    const preference = await this.getCoffeePreference(id);
    if (!preference) return undefined;
    
    const now = new Date();
    const updatedPreference = { ...preference, ...preferenceUpdate, updatedAt: now };
    this.coffeePreferenceMap.set(id, updatedPreference);
    return updatedPreference;
  }
  
  // Coffee meeting methods
  async getCoffeeMeeting(id: number): Promise<CoffeeMeeting | undefined> {
    return this.coffeeMeetingMap.get(id);
  }
  
  async getCoffeeMeetingsByUserId(userId: number): Promise<CoffeeMeeting[]> {
    return Array.from(this.coffeeMeetingMap.values())
      .filter(meeting => meeting.requesterId === userId || meeting.recipientId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first
  }
  
  async getCoffeeMeetingsBetweenUsers(user1Id: number, user2Id: number): Promise<CoffeeMeeting[]> {
    return Array.from(this.coffeeMeetingMap.values())
      .filter(meeting => 
        (meeting.requesterId === user1Id && meeting.recipientId === user2Id) ||
        (meeting.requesterId === user2Id && meeting.recipientId === user1Id)
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first
  }
  
  async createCoffeeMeeting(meeting: InsertCoffeeMeeting): Promise<CoffeeMeeting> {
    const id = this.coffeeMeetingIdCounter++;
    const now = new Date();
    const newMeeting: CoffeeMeeting = { 
      ...meeting, 
      id, 
      createdAt: now, 
      updatedAt: now,
      status: 'pending',
      meetingUrl: meeting.meetingUrl || null,
      scheduledDate: meeting.scheduledDate || null,
      scheduledEndTime: meeting.scheduledEndTime || null,
      matchScore: meeting.matchScore || null,
      matchReason: meeting.matchReason || null,
      notes: meeting.notes || null,
      feedback: null
    };
    this.coffeeMeetingMap.set(id, newMeeting);
    
    // Create a notification for the recipient
    await this.createNotification({
      userId: meeting.recipientId,
      type: 'message',
      content: `You have a new coffee chat request${meeting.scheduledDate ? ` for ${new Date(meeting.scheduledDate).toLocaleDateString()}` : ''}.`,
      relatedId: id
    });
    
    return newMeeting;
  }
  
  async updateCoffeeMeetingStatus(id: number, status: string): Promise<CoffeeMeeting | undefined> {
    const meeting = await this.getCoffeeMeeting(id);
    if (!meeting) return undefined;
    
    const now = new Date();
    const updatedMeeting = { ...meeting, status: status as any, updatedAt: now };
    this.coffeeMeetingMap.set(id, updatedMeeting);
    
    // Create a notification for the requester about the status change
    await this.createNotification({
      userId: meeting.requesterId,
      type: 'message',
      content: `Your coffee chat request${meeting.scheduledDate ? ` for ${new Date(meeting.scheduledDate).toLocaleDateString()}` : ''} has been ${status}.`,
      relatedId: id
    });
    
    return updatedMeeting;
  }
  
  async findMatchingUsers(userId: number, count: number = 5): Promise<{userId: number, matchScore: number, matchReason: string}[]> {
    const user = await this.getUser(userId);
    if (!user) return [];
    
    const userPreference = await this.getCoffeePreferenceByUserId(userId);
    if (!userPreference) return [];
    
    // Get all users
    const allUsers = Array.from(this.usersMap.values())
      .filter(u => u.id !== userId); // Exclude the current user
    
    // Calculate match scores
    const matches = await Promise.all(
      allUsers.map(async (otherUser) => {
        const otherUserPreference = await this.getCoffeePreferenceByUserId(otherUser.id);
        if (!otherUserPreference) return null;
        
        // Calculate match score based on role compatibility 
        // (founders match well with investors and vice versa)
        let matchScore = 0;
        let matchReason = '';
        
        if (user.role === 'founder' && otherUser.role === 'investor' || 
            user.role === 'investor' && otherUser.role === 'founder') {
          matchScore += 30;
          matchReason += 'Complementary roles. ';
        }
        
        // Check for shared interests if both users have specified them
        if (userPreference.preferredTopics && otherUserPreference.preferredTopics) {
          const userTopics = userPreference.preferredTopics.map(t => t.toLowerCase());
          const otherTopics = otherUserPreference.preferredTopics.map(t => t.toLowerCase());
          
          const sharedTopics = userTopics.filter(topic => otherTopics.includes(topic));
          if (sharedTopics.length > 0) {
            matchScore += sharedTopics.length * 10;
            matchReason += `Shared interests in: ${sharedTopics.join(', ')}. `;
          }
        }
        
        // Check for virtual/in-person preference match
        if (userPreference.virtualOnly === otherUserPreference.virtualOnly) {
          matchScore += 20;
          matchReason += `Same ${userPreference.virtualOnly ? 'virtual' : 'in-person'} meeting preference. `;
        }
        
        // Check previous meetings (fewer is better for new connections)
        const previousMeetings = await this.getCoffeeMeetingsBetweenUsers(userId, otherUser.id);
        if (previousMeetings.length === 0) {
          matchScore += 15;
          matchReason += 'No previous meetings. ';
        } else {
          // If they've met before but not recently, still a decent match
          const mostRecentMeeting = previousMeetings[0];
          if (mostRecentMeeting.scheduledDate) {
            const daysSinceLastMeeting = (Date.now() - new Date(mostRecentMeeting.scheduledDate).getTime()) / (1000 * 60 * 60 * 24);
            
            if (daysSinceLastMeeting > 30) {
              matchScore += 5;
              matchReason += 'Met more than a month ago. ';
            }
          }
        }
        
        return {
          userId: otherUser.id,
          matchScore,
          matchReason: matchReason.trim()
        };
      })
    );
    
    // Filter out nulls and sort by match score descending
    return matches
      .filter((match): match is {userId: number, matchScore: number, matchReason: string} => match !== null)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, count);
  }
}

import { DatabaseStorage } from "./database-storage";

// Use MemStorage for now until we implement the coffee chat methods in DatabaseStorage
export const storage = new MemStorage();
// export const storage = new DatabaseStorage();
