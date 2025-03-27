import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['investor', 'founder']);
export const startupStageEnum = pgEnum('startup_stage', ['idea', 'pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth']);
export const investmentStatusEnum = pgEnum('investment_status', ['pending', 'approved', 'escrow', 'released']);
export const messageStatusEnum = pgEnum('message_status', ['unread', 'read']);
export const notificationTypeEnum = pgEnum('notification_type', ['investment', 'message', 'milestone', 'event']);

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

// Additional login schema
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type LoginData = z.infer<typeof loginSchema>;
