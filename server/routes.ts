import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDailyStepSchema, 
  insertMoodSchema, 
  insertEventSchema,
  insertResourceSchema,
  insertUserResourceSchema,
  insertChatMessageSchema,
  insertAiInsightSchema
} from "@shared/schema";
import { generatePersonalizedMessage, handleChatMessage, generateProgressInsights } from "./services/aiService";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/current", async (req: Request, res: Response) => {
    try {
      // In a real app, this would use session/auth to identify the current user
      // For demo we'll use a hardcoded ID
      const currentUserId = 1;
      const user = await storage.getUser(currentUserId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Daily Steps routes
  app.get("/api/daily-steps", async (req: Request, res: Response) => {
    try {
      // In a real app, this would filter by the current user's ID
      const currentUserId = 1;
      const steps = await storage.getDailySteps(currentUserId);
      return res.json(steps);
    } catch (error) {
      console.error("Error fetching daily steps:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/daily-steps", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      
      // Validate request body
      const payload = insertDailyStepSchema.parse({
        ...req.body,
        userId: currentUserId,
        dueDate: new Date().toISOString().split('T')[0], // Today
      });
      
      const newStep = await storage.createDailyStep(payload);
      return res.status(201).json(newStep);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating daily step:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/daily-steps/:id", async (req: Request, res: Response) => {
    try {
      const stepId = parseInt(req.params.id);
      if (isNaN(stepId)) {
        return res.status(400).json({ message: "Invalid step ID" });
      }
      
      const { completed } = req.body;
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: "Completed status must be a boolean" });
      }
      
      const updated = await storage.updateDailyStep(stepId, { completed });
      if (!updated) {
        return res.status(404).json({ message: "Step not found" });
      }
      
      return res.json(updated);
    } catch (error) {
      console.error("Error updating daily step:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Mood tracking routes
  app.get("/api/moods/recent", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      const moods = await storage.getRecentMoods(currentUserId);
      return res.json(moods);
    } catch (error) {
      console.error("Error fetching recent moods:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/moods", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      
      // Validate request body
      const payload = insertMoodSchema.parse({
        ...req.body,
        userId: currentUserId,
        date: new Date().toISOString().split('T')[0], // Today
      });
      
      const newMood = await storage.createMood(payload);
      return res.status(201).json(newMood);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error logging mood:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // SCCS routes
  app.get("/api/sccs/current", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      const sccsScore = await storage.getCurrentSccsScore(currentUserId);
      
      if (!sccsScore) {
        return res.status(404).json({ message: "SCCS score not found" });
      }
      
      return res.json(sccsScore);
    } catch (error) {
      console.error("Error fetching SCCS score:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get full SCCS report
  app.get("/api/sccs/report", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      const sccsScore = await storage.getCurrentSccsScore(currentUserId);
      
      if (!sccsScore) {
        return res.status(404).json({ message: "SCCS score not found" });
      }
      
      // Get latest moods, events, and activity for report
      const recentMoods = await storage.getRecentMoods(currentUserId);
      const upcomingEvents = await storage.getUpcomingEvents(currentUserId);
      const dailySteps = await storage.getDailySteps(currentUserId);
      
      // Create full report with all relevant data
      const report = {
        score: sccsScore,
        history: [
          // Simulate 6-month history
          { date: new Date(Date.now() - 5 * 30 * 86400000).toISOString().split('T')[0], score: Math.max(30, sccsScore.score - 35) },
          { date: new Date(Date.now() - 4 * 30 * 86400000).toISOString().split('T')[0], score: Math.max(30, sccsScore.score - 28) },
          { date: new Date(Date.now() - 3 * 30 * 86400000).toISOString().split('T')[0], score: Math.max(30, sccsScore.score - 21) },
          { date: new Date(Date.now() - 2 * 30 * 86400000).toISOString().split('T')[0], score: Math.max(30, sccsScore.score - 14) },
          { date: new Date(Date.now() - 1 * 30 * 86400000).toISOString().split('T')[0], score: Math.max(30, sccsScore.score - 7) },
          { date: new Date().toISOString().split('T')[0], score: sccsScore.score },
        ],
        strengthAreas: [
          {
            category: "Consistency",
            score: sccsScore.consistency,
            maxScore: 30,
            description: "Shows up regularly for appointments and commitments"
          },
          {
            category: "Engagement",
            score: sccsScore.engagement,
            maxScore: 30,
            description: "Actively participates in community and program activities"
          },
          {
            category: "Milestones",
            score: sccsScore.milestones,
            maxScore: 30,
            description: "Achieves personal and program goals and milestones"
          },
          {
            category: "Peer Support",
            score: sccsScore.peerSupport,
            maxScore: 30,
            description: "Engages with and supports peers on similar journeys"
          }
        ],
        recentActivity: {
          moods: recentMoods.slice(0, 5),
          events: upcomingEvents.slice(0, 3),
          completedTasks: dailySteps.filter(step => step.completed).slice(0, 5)
        },
        recommendations: [
          "Attend 2 more community events this month to boost your engagement score",
          "Log your mood daily to improve consistency score",
          "Connect with 3 more peers in your program for peer support growth"
        ]
      };
      
      return res.json(report);
    } catch (error) {
      console.error("Error generating SCCS report:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get leaderboard data
  app.get("/api/sccs/leaderboard", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      
      // In a real app, this would fetch actual leaderboard data from the database
      // For now, we'll create simulated data
      const leaderboardData = [
        {
          userId: 5,
          username: "AngelaT",
          avatarInitials: "AT",
          score: 92,
          rank: 1,
          tier: "platinum",
          recentGrowth: 12
        },
        {
          userId: 8,
          username: "MarcusB",
          avatarInitials: "MB",
          score: 88,
          rank: 2,
          tier: "gold",
          recentGrowth: 5
        },
        {
          userId: 4,
          username: "SarahK",
          avatarInitials: "SK",
          score: 85,
          rank: 3,
          tier: "gold",
          recentGrowth: 7
        },
        {
          userId: 10,
          username: "DavidW",
          avatarInitials: "DW",
          score: 81,
          rank: 4,
          tier: "gold",
          recentGrowth: 3
        },
        {
          userId: 2,
          username: "jsmith",
          avatarInitials: "JS",
          score: 73,
          rank: 5,
          tier: "silver",
          recentGrowth: 9,
          isCurrentUser: true
        },
        {
          userId: 12,
          username: "RobertL",
          avatarInitials: "RL",
          score: 70,
          rank: 6,
          tier: "silver",
          recentGrowth: 4
        },
        {
          userId: 7,
          username: "TanyaM",
          avatarInitials: "TM",
          score: 67,
          rank: 7,
          tier: "silver",
          recentGrowth: 2
        },
        {
          userId: 15,
          username: "KristenF",
          avatarInitials: "KF",
          score: 62,
          rank: 8,
          tier: "silver",
          recentGrowth: 8
        },
        {
          userId: 20,
          username: "MichaelC",
          avatarInitials: "MC",
          score: 58,
          rank: 9,
          tier: "bronze",
          recentGrowth: 6
        },
        {
          userId: 18,
          username: "JasonT",
          avatarInitials: "JT",
          score: 53,
          rank: 10,
          tier: "bronze",
          recentGrowth: 11
        }
      ];
      
      // Add user's data and position
      const userData = {
        userRank: 5,
        totalUsers: 253,
        percentile: 98, // Top 2%
        leaderboard: leaderboardData
      };
      
      return res.json(userData);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Events routes
  app.get("/api/events/upcoming", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      const events = await storage.getUpcomingEvents(currentUserId);
      return res.json(events);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/events/:id/rsvp", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const currentUserId = 1; // In a real app, get from session
      const updated = await storage.updateEventStatus(eventId, currentUserId, 'confirmed');
      
      if (!updated) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      return res.json(updated);
    } catch (error) {
      console.error("Error RSVPing to event:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Care team routes
  app.get("/api/care-team", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      const careTeam = await storage.getCareTeam(currentUserId);
      return res.json(careTeam);
    } catch (error) {
      console.error("Error fetching care team:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Resources routes
  app.get("/api/resources/recommended", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      const resources = await storage.getRecommendedResources(currentUserId);
      return res.json(resources);
    } catch (error) {
      console.error("Error fetching recommended resources:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/resources/:id/bookmark", async (req: Request, res: Response) => {
    try {
      const resourceId = parseInt(req.params.id);
      if (isNaN(resourceId)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const currentUserId = 1; // In a real app, get from session
      
      // Add bookmark
      const bookmarkPayload = insertUserResourceSchema.parse({
        userId: currentUserId,
        resourceId: resourceId,
        isBookmarked: true
      });
      
      const bookmark = await storage.bookmarkResource(bookmarkPayload);
      return res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error bookmarking resource:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/resources/:id/bookmark", async (req: Request, res: Response) => {
    try {
      const resourceId = parseInt(req.params.id);
      if (isNaN(resourceId)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const currentUserId = 1; // In a real app, get from session
      
      const removed = await storage.removeResourceBookmark(currentUserId, resourceId);
      if (!removed) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      console.error("Error removing bookmark:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // AI Companion Routes
  app.get("/api/ai/personalized-message", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      
      // Get user data and context
      const user = await storage.getUser(currentUserId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const recentMoods = await storage.getRecentMoods(currentUserId);
      const dailySteps = await storage.getDailySteps(currentUserId);
      const upcomingEvents = await storage.getUpcomingEvents(currentUserId);
      const recommendedResources = await storage.getRecommendedResources(currentUserId);
      
      // Generate personalized message using OpenAI
      const message = await generatePersonalizedMessage({
        user,
        recentMoods,
        dailySteps,
        upcomingEvents,
        recommendedResources
      });
      
      return res.json({ message });
    } catch (error) {
      console.error("Error generating personalized message:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/ai/chat/:sessionId", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      const messages = await storage.getChatMessages(currentUserId, sessionId);
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/ai/chat/:sessionId", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      const { sessionId } = req.params;
      const { message } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      if (!message) {
        return res.status(400).json({ message: "Message content is required" });
      }
      
      // Create user message
      const userMessagePayload = insertChatMessageSchema.parse({
        userId: currentUserId,
        role: "user",
        content: message,
        chatSessionId: sessionId
      });
      
      const userMessage = await storage.createChatMessage(userMessagePayload);
      
      // Get previous messages for context
      const previousMessages = await storage.getChatMessages(currentUserId, sessionId);
      const chatHistory = previousMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
      
      // Generate AI response
      const aiResponse = await handleChatMessage(
        currentUserId,
        message,
        chatHistory
      );
      
      // Store AI response
      const aiMessagePayload = insertChatMessageSchema.parse({
        userId: currentUserId,
        role: "assistant",
        content: aiResponse,
        chatSessionId: sessionId
      });
      
      const assistantMessage = await storage.createChatMessage(aiMessagePayload);
      
      return res.json({
        userMessage,
        assistantMessage
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error processing chat message:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/ai/insights", async (req: Request, res: Response) => {
    try {
      const currentUserId = 1; // In a real app, get from session
      
      // Check if we already have recent insights
      const existingInsights = await storage.getLatestAiInsight(currentUserId);
      
      // If insights exist and are less than 24 hours old, return them
      if (existingInsights) {
        const insightsAge = Date.now() - existingInsights.createdAt.getTime();
        const hoursSinceGenerated = insightsAge / (1000 * 60 * 60);
        
        if (hoursSinceGenerated < 24) {
          return res.json(existingInsights);
        }
      }
      
      // Otherwise, generate new insights
      const user = await storage.getUser(currentUserId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const recentMoods = await storage.getRecentMoods(currentUserId);
      const dailySteps = await storage.getDailySteps(currentUserId);
      const upcomingEvents = await storage.getUpcomingEvents(currentUserId);
      
      // Generate insights using OpenAI
      const insights = await generateProgressInsights({
        user,
        recentMoods,
        dailySteps,
        upcomingEvents
      });
      
      // Store the insights
      const insightsPayload = insertAiInsightSchema.parse({
        userId: currentUserId,
        insights: insights.insights,
        strengthsIdentified: insights.strengthsIdentified,
        suggestedResources: insights.suggestedResources
      });
      
      const savedInsights = await storage.createAiInsight(insightsPayload);
      return res.json(savedInsights);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
