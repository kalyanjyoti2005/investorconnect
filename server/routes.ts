import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { setupWebSocketServer } from "./ws";
import { z } from "zod";
import { db } from "./db";
import { 
  insertStartupSchema, 
  insertInvestmentSchema, 
  insertMilestoneSchema, 
  insertNdaSchema, 
  insertMessageSchema, 
  insertEventSchema, 
  insertEventParticipantSchema, 
  insertVoteSchema, 
  insertNotificationSchema,
  insertDiscussionSchema,
  insertDiscussionCommentSchema,
  insertDiscussionVoteSchema,
  insertHackathonTeamSchema,
  insertHackathonTeamMemberSchema,
  insertHackathonChatMessageSchema,
  insertBadgeSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Not authenticated" });
  };
  
  // User routes
  app.get("/api/users", isAuthenticated, async (req, res) => {
    try {
      // Get all users from the storage
      const users = [];
      
      // Create a simulated list of users until we have a getAllUsers method
      // In a real implementation, you would call storage.getAllUsers()
      const currentUser = req.user;
      
      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Add some sample users
      const demoUsers = [
        { id: 1, name: "John Investor", username: "investor1", role: "investor", bio: "Angel investor with 10+ years experience", createdAt: new Date() },
        { id: 2, name: "Sarah Founder", username: "founder1", role: "founder", bio: "Tech entrepreneur and startup founder", createdAt: new Date() },
        { id: 3, name: "Michael VC", username: "investor2", role: "investor", bio: "Venture capital partner focused on early-stage startups", createdAt: new Date() },
        { id: 4, name: "Lisa Tech", username: "founder2", role: "founder", bio: "Serial entrepreneur with 3 successful exits", createdAt: new Date() }
      ];
      
      // Only add the demo users if they don't conflict with the current user
      for (const demoUser of demoUsers) {
        if (demoUser.id !== currentUser?.id) {
          users.push(demoUser);
        }
      }
      
      // Add the current user
      users.push(currentUser);
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Middleware to check if user is an investor
  const isInvestor = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user.role === "investor") {
      return next();
    }
    res.status(403).json({ message: "Access denied, investor role required" });
  };

  // Middleware to check if user is a founder
  const isFounder = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user.role === "founder") {
      return next();
    }
    res.status(403).json({ message: "Access denied, founder role required" });
  };

  // Startup routes
  app.get("/api/startups", isAuthenticated, async (req, res) => {
    const startups = await storage.getAllStartups();
    res.json(startups);
  });

  app.get("/api/startups/:id", isAuthenticated, async (req, res) => {
    const startup = await storage.getStartup(parseInt(req.params.id));
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    res.json(startup);
  });

  app.post("/api/startups", isFounder, async (req, res) => {
    try {
      const validatedData = insertStartupSchema.parse({
        ...req.body,
        founderId: req.user!.id
      });
      const startup = await storage.createStartup(validatedData);
      res.status(201).json(startup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/startups/:id", isFounder, async (req, res) => {
    const startupId = parseInt(req.params.id);
    const startup = await storage.getStartup(startupId);
    
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    
    if (startup.founderId !== req.user!.id) {
      return res.status(403).json({ message: "Not authorized to update this startup" });
    }
    
    try {
      const updatedStartup = await storage.updateStartup(startupId, req.body);
      res.json(updatedStartup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Investment routes
  app.get("/api/investments/investor", isInvestor, async (req, res) => {
    const investments = await storage.getInvestmentsByInvestorId(req.user!.id);
    res.json(investments);
  });

  app.get("/api/investments/startup/:startupId", isAuthenticated, async (req, res) => {
    const startupId = parseInt(req.params.startupId);
    const startup = await storage.getStartup(startupId);
    
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    
    // Only allow the founder of the startup or investors to see investments
    if (req.user!.role === "founder" && startup.founderId !== req.user!.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const investments = await storage.getInvestmentsByStartupId(startupId);
    res.json(investments);
  });

  app.post("/api/investments", isInvestor, async (req, res) => {
    try {
      const validatedData = insertInvestmentSchema.parse({
        ...req.body,
        investorId: req.user!.id
      });
      
      const startup = await storage.getStartup(validatedData.startupId);
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
      
      const investment = await storage.createInvestment(validatedData);
      
      // Create a notification for the founder
      await storage.createNotification({
        userId: startup.founderId,
        type: "investment",
        content: `You have received a new investment of $${investment.amount} for ${startup.name}`,
        relatedId: investment.id
      });
      
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/investments/:id/status", isAuthenticated, async (req, res) => {
    const investmentId = parseInt(req.params.id);
    const { status } = req.body;
    
    if (!status || !["pending", "approved", "escrow", "released"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const investment = await storage.getInvestment(investmentId);
    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }
    
    const startup = await storage.getStartup(investment.startupId);
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    
    // Ensure only the founder of the startup or the investor can update status
    if (
      (req.user!.role === "founder" && startup.founderId !== req.user!.id) ||
      (req.user!.role === "investor" && investment.investorId !== req.user!.id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const updatedInvestment = await storage.updateInvestmentStatus(investmentId, status);
      
      // Create notifications for status updates
      if (status === "approved") {
        // Notify investor
        await storage.createNotification({
          userId: investment.investorId,
          type: "investment",
          content: `Your investment in ${startup.name} has been approved`,
          relatedId: investment.id
        });
      } else if (status === "released") {
        // Notify both parties
        await storage.createNotification({
          userId: investment.investorId,
          type: "investment",
          content: `Funds released for your investment in ${startup.name}`,
          relatedId: investment.id
        });
        
        await storage.createNotification({
          userId: startup.founderId,
          type: "investment",
          content: `Funds have been released for ${startup.name}`,
          relatedId: investment.id
        });
      }
      
      res.json(updatedInvestment);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Milestone routes
  app.get("/api/startups/:startupId/milestones", isAuthenticated, async (req, res) => {
    const startupId = parseInt(req.params.startupId);
    const milestones = await storage.getMilestonesByStartupId(startupId);
    res.json(milestones);
  });

  app.post("/api/milestones", isFounder, async (req, res) => {
    try {
      const validatedData = insertMilestoneSchema.parse(req.body);
      
      const startup = await storage.getStartup(validatedData.startupId);
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
      
      if (startup.founderId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const milestone = await storage.createMilestone(validatedData);
      res.status(201).json(milestone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/milestones/:id/complete", isFounder, async (req, res) => {
    const milestoneId = parseInt(req.params.id);
    const milestone = await storage.getMilestone(milestoneId);
    
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }
    
    const startup = await storage.getStartup(milestone.startupId);
    if (!startup || startup.founderId !== req.user!.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const updatedMilestone = await storage.completeMilestone(milestoneId);
      
      // Get all investors for this startup
      const investments = await storage.getInvestmentsByStartupId(startup.id);
      const investorIds = Array.from(new Set(investments.map(inv => inv.investorId)));
      
      // Create notifications for all investors
      for (const investorId of investorIds) {
        await storage.createNotification({
          userId: investorId,
          type: "milestone",
          content: `${startup.name} has completed a milestone: ${milestone.name}`,
          relatedId: milestone.id
        });
      }
      
      res.json(updatedMilestone);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // NDA routes
  app.get("/api/ndas/investor", isInvestor, async (req, res) => {
    const startupId = req.query.startupId ? parseInt(req.query.startupId as string) : undefined;
    
    if (startupId) {
      const nda = await storage.getNdaByInvestorAndStartup(req.user!.id, startupId);
      return res.json(nda || null);
    }
    
    // This endpoint would need to be expanded to get all NDAs for an investor
    res.status(400).json({ message: "startupId query parameter required" });
  });

  app.get("/api/ndas/startup/:startupId", isFounder, async (req, res) => {
    const startupId = parseInt(req.params.startupId);
    const startup = await storage.getStartup(startupId);
    
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    
    if (startup.founderId !== req.user!.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const ndas = await storage.getNdasByStartupId(startupId);
    res.json(ndas);
  });

  app.post("/api/ndas", isInvestor, async (req, res) => {
    try {
      const validatedData = insertNdaSchema.parse({
        ...req.body,
        investorId: req.user!.id
      });
      
      const startup = await storage.getStartup(validatedData.startupId);
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
      
      // Check if NDA already exists
      const existingNda = await storage.getNdaByInvestorAndStartup(req.user!.id, validatedData.startupId);
      if (existingNda) {
        return res.status(400).json({ message: "NDA request already exists" });
      }
      
      const nda = await storage.createNda(validatedData);
      
      // Create notification for founder
      await storage.createNotification({
        userId: startup.founderId,
        type: "message",
        content: `An investor has requested to sign an NDA for ${startup.name}`,
        relatedId: nda.id
      });
      
      res.status(201).json(nda);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/ndas/:id/sign", isInvestor, async (req, res) => {
    const ndaId = parseInt(req.params.id);
    const nda = await storage.getNda(ndaId);
    
    if (!nda) {
      return res.status(404).json({ message: "NDA not found" });
    }
    
    if (nda.investorId !== req.user!.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const signedNda = await storage.signNda(ndaId);
      
      // Get the startup details
      const startup = await storage.getStartup(nda.startupId);
      if (startup) {
        // Notify the founder
        await storage.createNotification({
          userId: startup.founderId,
          type: "message",
          content: `An investor has signed the NDA for ${startup.name}`,
          relatedId: nda.id
        });
      }
      
      res.json(signedNda);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Message routes
  app.get("/api/messages", isAuthenticated, async (req, res) => {
    const userId = req.user!.id;
    const messages = await storage.getUserMessages(userId);
    res.json(messages);
  });

  app.get("/api/messages/:userId", isAuthenticated, async (req, res) => {
    const currentUserId = req.user!.id;
    const otherUserId = parseInt(req.params.userId);
    
    const messages = await storage.getMessagesBetweenUsers(currentUserId, otherUserId);
    res.json(messages);
  });

  app.post("/api/messages", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user!.id
      });
      
      // Check if receiver exists
      const receiver = await storage.getUser(validatedData.receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
      
      const message = await storage.createMessage(validatedData);
      
      // Create notification for receiver
      await storage.createNotification({
        userId: validatedData.receiverId,
        type: "message",
        content: `You have received a new message from ${req.user!.name}`,
        relatedId: message.id
      });
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/messages/:id/read", isAuthenticated, async (req, res) => {
    const messageId = parseInt(req.params.id);
    const message = await storage.getMessage(messageId);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    if (message.receiverId !== req.user!.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const updatedMessage = await storage.markMessageAsRead(messageId);
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Event routes
  app.get("/api/events", isAuthenticated, async (req, res) => {
    const events = await storage.getAllEvents();
    res.json(events);
  });

  app.post("/api/events", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/events/:eventId/participants", isAuthenticated, async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    
    try {
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      const validatedData = insertEventParticipantSchema.parse({
        eventId,
        userId: req.user!.id
      });
      
      // Check if user is already a participant
      const participants = await storage.getEventParticipantsByEventId(eventId);
      const isAlreadyParticipant = participants.some(p => p.userId === req.user!.id);
      
      if (isAlreadyParticipant) {
        return res.status(400).json({ message: "Already registered for this event" });
      }
      
      const eventParticipant = await storage.createEventParticipant(validatedData);
      res.status(201).json(eventParticipant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Vote routes
  app.post("/api/votes", isInvestor, async (req, res) => {
    try {
      const validatedData = insertVoteSchema.parse({
        ...req.body,
        investorId: req.user!.id
      });
      
      // Check if startup exists
      const startup = await storage.getStartup(validatedData.startupId);
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
      
      // Check if user has already voted
      const existingVote = await storage.getVoteByInvestorAndStartup(req.user!.id, validatedData.startupId);
      
      if (existingVote) {
        // Update existing vote
        const updatedVote = await storage.updateVote(existingVote.id, validatedData.voteType);
        return res.json(updatedVote);
      }
      
      const vote = await storage.createVote(validatedData);
      
      // Create notification for founder
      await storage.createNotification({
        userId: startup.founderId,
        type: "message",
        content: `An investor has ${validatedData.voteType === 1 ? 'upvoted' : 'downvoted'} your startup`,
        relatedId: vote.id
      });
      
      res.status(201).json(vote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Notification routes
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    const notifications = await storage.getNotificationsByUserId(req.user!.id);
    res.json(notifications);
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    const notificationId = parseInt(req.params.id);
    const notification = await storage.getNotification(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    if (notification.userId !== req.user!.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    try {
      const updatedNotification = await storage.markNotificationAsRead(notificationId);
      res.json(updatedNotification);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Community Discussion routes
  app.get("/api/discussions", isAuthenticated, async (req, res) => {
    try {
      const tag = req.query.tag as string | undefined;
      const discussions = tag 
        ? await storage.getDiscussionsByTag(tag)
        : await storage.getAllDiscussions();
      res.json(discussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/discussions/:id", isAuthenticated, async (req, res) => {
    try {
      const discussionId = parseInt(req.params.id);
      const discussion = await storage.getDiscussion(discussionId);
      
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }
      
      res.json(discussion);
    } catch (error) {
      console.error("Error fetching discussion:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/discussions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const validatedData = insertDiscussionSchema.parse({
        ...req.body,
        authorId: userId
      });
      
      const discussion = await storage.createDiscussion(validatedData);
      res.status(201).json(discussion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating discussion:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/discussions/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const discussionId = parseInt(req.params.id);
      const comments = await storage.getCommentsByDiscussionId(discussionId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/discussions/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const discussionId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      const discussion = await storage.getDiscussion(discussionId);
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }
      
      const validatedData = insertDiscussionCommentSchema.parse({
        ...req.body,
        discussionId,
        authorId: userId
      });
      
      const comment = await storage.createDiscussionComment(validatedData);
      
      // Create notification for the discussion author (if not the same as comment author)
      if (discussion.authorId !== userId) {
        await storage.createNotification({
          userId: discussion.authorId,
          type: "discussion",
          content: `${req.user!.name} commented on your discussion: "${discussion.title}"`,
          relatedId: discussionId
        });
      }
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/discussions/:id/vote", isAuthenticated, async (req, res) => {
    try {
      const discussionId = parseInt(req.params.id);
      const userId = req.user!.id;
      const { voteType } = req.body;
      
      if (typeof voteType !== 'number' || ![1, -1, 0].includes(voteType)) {
        return res.status(400).json({ message: "voteType must be 1 (upvote), -1 (downvote), or 0 (remove vote)" });
      }
      
      const discussion = await storage.getDiscussion(discussionId);
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }
      
      // Check if user already voted on this discussion
      const existingVote = await storage.getDiscussionVoteByUserAndDiscussion(userId, discussionId);
      
      let vote;
      if (existingVote) {
        // Update existing vote
        vote = await storage.updateDiscussionVote(existingVote.id, voteType);
      } else if (voteType !== 0) {
        // Create new vote (only if vote type is not 0)
        vote = await storage.createDiscussionVote({
          userId,
          discussionId,
          voteType,
          commentId: null
        });
      }
      
      res.status(201).json(vote || { message: "Vote removed" });
    } catch (error) {
      console.error("Error processing vote:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/comments/:id/vote", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const userId = req.user!.id;
      const { voteType } = req.body;
      
      if (typeof voteType !== 'number' || ![1, -1, 0].includes(voteType)) {
        return res.status(400).json({ message: "voteType must be 1 (upvote), -1 (downvote), or 0 (remove vote)" });
      }
      
      const comment = await storage.getDiscussionComment(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      // Check if user already voted on this comment
      const existingVote = await storage.getDiscussionVoteByUserAndComment(userId, commentId);
      
      let vote;
      if (existingVote) {
        // Update existing vote
        vote = await storage.updateDiscussionVote(existingVote.id, voteType);
      } else if (voteType !== 0) {
        // Create new vote (only if vote type is not 0)
        vote = await storage.createDiscussionVote({
          userId,
          discussionId: comment.discussionId,
          commentId,
          voteType
        });
      }
      
      res.status(201).json(vote || { message: "Vote removed" });
    } catch (error) {
      console.error("Error processing vote:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Hackathon Team routes
  app.get("/api/hackathon/teams", isAuthenticated, async (req, res) => {
    try {
      const teams = await storage.getAllHackathonTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching hackathon teams:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/hackathon/teams/:id", isAuthenticated, async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const team = await storage.getHackathonTeam(teamId);
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/hackathon/teams", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertHackathonTeamSchema.parse(req.body);
      const team = await storage.createHackathonTeam(validatedData);
      
      // Automatically add the creator as a team leader
      await storage.createHackathonTeamMember({
        teamId: team.id,
        userId: req.user!.id,
        isLeader: true
      });
      
      res.status(201).json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/hackathon/teams/:id/members", isAuthenticated, async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const members = await storage.getHackathonTeamMembersByTeamId(teamId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/hackathon/teams/:id/members", isAuthenticated, async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const userId = req.body.userId;
      
      // Check if team exists
      const team = await storage.getHackathonTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user is already a member
      const members = await storage.getHackathonTeamMembersByTeamId(teamId);
      const isMember = members.some(member => member.userId === userId);
      if (isMember) {
        return res.status(400).json({ message: "User is already a team member" });
      }
      
      // Add member
      const member = await storage.createHackathonTeamMember({
        teamId,
        userId,
        isLeader: false
      });
      
      // Notify user about team invitation
      await storage.createNotification({
        userId,
        type: "event",
        content: `You have been added to the hackathon team: ${team.name}`,
        relatedId: teamId
      });
      
      res.status(201).json(member);
    } catch (error) {
      console.error("Error adding team member:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/hackathon/teams/:teamId/members/:memberId/leader", isAuthenticated, async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const memberId = parseInt(req.params.memberId);
      
      // Verify team exists
      const team = await storage.getHackathonTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Verify requester is a team leader
      const teamMembers = await storage.getHackathonTeamMembersByTeamId(teamId);
      const currentUserMember = teamMembers.find(member => member.userId === req.user!.id);
      
      if (!currentUserMember || !currentUserMember.isLeader) {
        return res.status(403).json({ message: "Only team leaders can assign leadership" });
      }
      
      // Check if member exists
      const member = await storage.getHackathonTeamMember(memberId);
      if (!member || member.teamId !== teamId) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      // Update leadership
      const updatedMember = await storage.makeTeamLeader(memberId);
      
      // Notify user about leadership change
      await storage.createNotification({
        userId: member.userId,
        type: "event",
        content: `You have been made a leader of the hackathon team: ${team.name}`,
        relatedId: teamId
      });
      
      res.json(updatedMember);
    } catch (error) {
      console.error("Error changing team leadership:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/hackathon/teams/:id/chat", isAuthenticated, async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      
      // Verify team exists
      const team = await storage.getHackathonTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Verify user is a team member
      const teamMembers = await storage.getHackathonTeamMembersByTeamId(teamId);
      const isMember = teamMembers.some(member => member.userId === req.user!.id);
      
      if (!isMember) {
        return res.status(403).json({ message: "Only team members can access chat" });
      }
      
      // Get messages
      const messages = await storage.getHackathonChatMessagesByTeamId(teamId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/hackathon/teams/:id/chat", isAuthenticated, async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const { content } = req.body;
      
      if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ message: "Message content is required" });
      }
      
      // Verify team exists
      const team = await storage.getHackathonTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Verify user is a team member
      const teamMembers = await storage.getHackathonTeamMembersByTeamId(teamId);
      const isMember = teamMembers.some(member => member.userId === req.user!.id);
      
      if (!isMember) {
        return res.status(403).json({ message: "Only team members can send messages" });
      }
      
      // Create message
      const message = await storage.createHackathonChatMessage({
        teamId,
        senderId: req.user!.id,
        content
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Badge routes
  app.get("/api/badges", isAuthenticated, async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : req.user!.id;
      const badges = await storage.getBadgesByUserId(userId);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/badges", isAuthenticated, async (req, res) => {
    try {
      // In a real app, you would validate admin permissions here
      const validatedData = insertBadgeSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const badge = await storage.createBadge(validatedData);
      res.status(201).json(badge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating badge:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time chat
  setupWebSocketServer(httpServer);
  
  return httpServer;
}
