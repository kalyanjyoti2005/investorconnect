import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['investor', 'founder']);
export const startupStageEnum = pgEnum('startup_stage', ['idea', 'pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth']);
export const investmentStatusEnum = pgEnum('investment_status', ['pending', 'approved', 'escrow', 'released']);
export const messageStatusEnum = pgEnum('message_status', ['unread', 'read']);
export const notificationTypeEnum = pgEnum('notification_type', ['investment', 'message', 'milestone', 'event', 'discussion', 'badge']);
export const discussionTagEnum = pgEnum('discussion_tag', ['funding', 'startups', 'growth', 'technology', 'hackathon', 'pitch', 'networking', 'investing']);
export const badgeTypeEnum = pgEnum('badge_type', ['top_contributor', 'innovator', 'growth_hacker', 'mentor', 'hackathon_winner', 'investor_expert']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").notNull(),
  name: text("name").notNull(),
  bio: text("bio").default(''),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Startups table
export const startups = pgTable("startups", {
  id: serial("id").primaryKey(),
  founderId: integer("founder_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  logo: text("logo"),
  description: text("description").notNull(),
  industry: text("industry").notNull(),
  stage: startupStageEnum("stage").notNull(),
  fundingGoal: integer("funding_goal").notNull(),
  currentFunding: integer("current_funding").default(0),
  businessPlan: text("business_plan"),
  pitchDeck: text("pitch_deck"),
  website: text("website"),
  trendingScore: integer("trending_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Investments table
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  investorId: integer("investor_id").notNull().references(() => users.id),
  startupId: integer("startup_id").notNull().references(() => startups.id),
  amount: integer("amount").notNull(),
  status: investmentStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Milestones table
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  startupId: integer("startup_id").notNull().references(() => startups.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  fundingAmount: integer("funding_amount"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// NDAs table
export const ndas = pgTable("ndas", {
  id: serial("id").primaryKey(),
  investorId: integer("investor_id").notNull().references(() => users.id),
  startupId: integer("startup_id").notNull().references(() => startups.id),
  signed: boolean("signed").default(false),
  signedAt: timestamp("signed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  status: messageStatusEnum("status").notNull().default("unread"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Event participants table
export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Votes table
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  investorId: integer("investor_id").notNull().references(() => users.id),
  startupId: integer("startup_id").notNull().references(() => startups.id),
  voteType: integer("vote_type").notNull(), // 1 for upvote, -1 for downvote
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  content: text("content").notNull(),
  relatedId: integer("related_id"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Discussion forum table
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tag: discussionTagEnum("tag").notNull(),
  isPinned: boolean("is_pinned").default(false),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Discussion comments table
export const discussionComments = pgTable("discussion_comments", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").notNull().references(() => discussions.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Discussion votes table
export const discussionVotes = pgTable("discussion_votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  discussionId: integer("discussion_id").references(() => discussions.id),
  commentId: integer("comment_id").references(() => discussionComments.id),
  voteType: integer("vote_type").notNull(), // 1 for upvote, -1 for downvote
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Hackathon teams table
export const hackathonTeams = pgTable("hackathon_teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Hackathon team members table
export const hackathonTeamMembers = pgTable("hackathon_team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().references(() => hackathonTeams.id),
  userId: integer("user_id").notNull().references(() => users.id),
  isLeader: boolean("is_leader").default(false),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Hackathon chat messages table
export const hackathonChatMessages = pgTable("hackathon_chat_messages", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().references(() => hackathonTeams.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Badges table
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: badgeTypeEnum("type").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  awardedAt: timestamp("awarded_at").defaultNow().notNull(),
});

// Coffee chat availability slots
export const coffeeAvailability = pgTable("coffee_availability", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: text("start_time").notNull(), // HH:MM 24h format
  endTime: text("end_time").notNull(), // HH:MM 24h format
  isRecurring: boolean("is_recurring").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Coffee chat preferences
export const coffeePreferences = pgTable("coffee_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  preferredTopics: text("preferred_topics").array(), // Array of topics interested in discussing
  preferredRoles: text("preferred_roles").array(), // Array of roles they want to meet (founder, investor, etc.)
  preferredIndustries: text("preferred_industries").array(), // Array of industries they want to connect with
  meetingFrequency: text("meeting_frequency").notNull(), // weekly, bi-weekly, monthly
  maxMeetingsPerWeek: integer("max_meetings_per_week").default(2),
  virtualOnly: boolean("virtual_only").default(true),
  bio: text("bio"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Coffee chat meetings
export const coffeeMeetings = pgTable("coffee_meetings", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").notNull().references(() => users.id),
  recipientId: integer("recipient_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, accepted, declined, completed, cancelled
  scheduledDate: timestamp("scheduled_date"),
  scheduledEndTime: timestamp("scheduled_end_time"),
  meetingUrl: text("meeting_url"), // For virtual meetings
  matchScore: real("match_score"), // How well the algorithm matched these users (0-1)
  matchReason: text("match_reason"), // Why these users were matched
  notes: text("notes"), // Pre-meeting notes or agenda
  feedback: text("feedback"), // Post-meeting feedback
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for insertions
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertStartupSchema = createInsertSchema(startups).omit({ id: true, createdAt: true, currentFunding: true, trendingScore: true });
export const insertInvestmentSchema = createInsertSchema(investments).omit({ id: true, createdAt: true });
export const insertMilestoneSchema = createInsertSchema(milestones).omit({ id: true, createdAt: true, completed: true, completedAt: true });
export const insertNdaSchema = createInsertSchema(ndas).omit({ id: true, createdAt: true, signed: true, signedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true, status: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertEventParticipantSchema = createInsertSchema(eventParticipants).omit({ id: true, createdAt: true });
export const insertVoteSchema = createInsertSchema(votes).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true, read: true });

// Community-related schemas
export const insertDiscussionSchema = createInsertSchema(discussions).omit({ id: true, createdAt: true, upvotes: true, downvotes: true, isPinned: true, isVerified: true });
export const insertDiscussionCommentSchema = createInsertSchema(discussionComments).omit({ id: true, createdAt: true, upvotes: true, downvotes: true, isVerified: true });
export const insertDiscussionVoteSchema = createInsertSchema(discussionVotes).omit({ id: true, createdAt: true });
export const insertHackathonTeamSchema = createInsertSchema(hackathonTeams).omit({ id: true, createdAt: true });
export const insertHackathonTeamMemberSchema = createInsertSchema(hackathonTeamMembers).omit({ id: true, joinedAt: true });
export const insertHackathonChatMessageSchema = createInsertSchema(hackathonChatMessages).omit({ id: true, createdAt: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, awardedAt: true });

// Coffee chat schemas
export const insertCoffeeAvailabilitySchema = createInsertSchema(coffeeAvailability).omit({ id: true, createdAt: true });
export const insertCoffeePreferenceSchema = createInsertSchema(coffeePreferences).omit({ id: true, updatedAt: true });
export const insertCoffeeMeetingSchema = createInsertSchema(coffeeMeetings).omit({ id: true, createdAt: true, updatedAt: true, status: true });

// Type exports for insertion
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStartup = z.infer<typeof insertStartupSchema>;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type InsertNda = z.infer<typeof insertNdaSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Community-related insertion types
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type InsertDiscussionComment = z.infer<typeof insertDiscussionCommentSchema>;
export type InsertDiscussionVote = z.infer<typeof insertDiscussionVoteSchema>;
export type InsertHackathonTeam = z.infer<typeof insertHackathonTeamSchema>;
export type InsertHackathonTeamMember = z.infer<typeof insertHackathonTeamMemberSchema>;
export type InsertHackathonChatMessage = z.infer<typeof insertHackathonChatMessageSchema>;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

// Coffee chat insertion types
export type InsertCoffeeAvailability = z.infer<typeof insertCoffeeAvailabilitySchema>;
export type InsertCoffeePreference = z.infer<typeof insertCoffeePreferenceSchema>;
export type InsertCoffeeMeeting = z.infer<typeof insertCoffeeMeetingSchema>;

// Type exports for selection
export type User = typeof users.$inferSelect;
export type Startup = typeof startups.$inferSelect;
export type Investment = typeof investments.$inferSelect;
export type Milestone = typeof milestones.$inferSelect;
export type Nda = typeof ndas.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Event = typeof events.$inferSelect;
export type EventParticipant = typeof eventParticipants.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

// Community-related selection types
export type Discussion = typeof discussions.$inferSelect;
export type DiscussionComment = typeof discussionComments.$inferSelect;
export type DiscussionVote = typeof discussionVotes.$inferSelect;
export type HackathonTeam = typeof hackathonTeams.$inferSelect;
export type HackathonTeamMember = typeof hackathonTeamMembers.$inferSelect;
export type HackathonChatMessage = typeof hackathonChatMessages.$inferSelect;
export type Badge = typeof badges.$inferSelect;

// Coffee chat selection types
export type CoffeeAvailability = typeof coffeeAvailability.$inferSelect;
export type CoffeePreference = typeof coffeePreferences.$inferSelect;
export type CoffeeMeeting = typeof coffeeMeetings.$inferSelect;

// Additional login schema
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type LoginData = z.infer<typeof loginSchema>;
