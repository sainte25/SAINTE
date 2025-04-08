import { 
  users, type User, type InsertUser, 
  dailySteps, type DailyStep, type InsertDailyStep,
  moods, type Mood, type InsertMood,
  sccsScores, type SccsScore, type InsertSccsScore,
  events, type Event, type InsertEvent,
  careTeamMembers, type CareTeamMember, type InsertCareTeamMember,
  resources, type Resource, type InsertResource,
  userResources, type UserResource, type InsertUserResource,
  chatMessages, type ChatMessage, type InsertChatMessage,
  aiInsights, type AiInsight, type InsertAiInsight
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

import { db } from "./db";
import { and, asc, desc, eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Daily steps methods
  getDailySteps(userId: number): Promise<DailyStep[]>;
  getDailyStep(id: number): Promise<DailyStep | undefined>;
  createDailyStep(step: InsertDailyStep): Promise<DailyStep>;
  updateDailyStep(id: number, updates: Partial<DailyStep>): Promise<DailyStep | undefined>;
  deleteDailyStep(id: number): Promise<boolean>;
  
  // Mood methods
  getRecentMoods(userId: number): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;
  
  // SCCS methods
  getCurrentSccsScore(userId: number): Promise<SccsScore | undefined>;
  
  // Events methods
  getUpcomingEvents(userId: number): Promise<Event[]>;
  updateEventStatus(id: number, userId: number, status: string): Promise<Event | undefined>;
  
  // Care team methods
  getCareTeam(userId: number): Promise<CareTeamMember[]>;
  
  // Resources methods
  getRecommendedResources(userId: number): Promise<(Resource & { isBookmarked?: boolean })[]>;
  bookmarkResource(userResource: InsertUserResource): Promise<UserResource>;
  removeResourceBookmark(userId: number, resourceId: number): Promise<boolean>;
  
  // AI Chat methods
  getChatMessages(userId: number, chatSessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // AI Insights methods
  getLatestAiInsight(userId: number): Promise<AiInsight | undefined>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dailySteps: Map<number, DailyStep>;
  private moods: Map<number, Mood>;
  private sccsScores: Map<number, SccsScore>;
  private events: Map<number, Event>;
  private careTeamMembers: Map<number, CareTeamMember>;
  private resources: Map<number, Resource>;
  private userResources: Map<number, UserResource>;
  private chatMessages: Map<number, ChatMessage>;
  private aiInsights: Map<number, AiInsight>;
  
  private userIdCounter: number;
  private dailyStepIdCounter: number;
  private moodIdCounter: number;
  private sccsScoreIdCounter: number;
  private eventIdCounter: number;
  private careTeamMemberIdCounter: number;
  private resourceIdCounter: number;
  private userResourceIdCounter: number;
  private chatMessageIdCounter: number;
  private aiInsightIdCounter: number;

  constructor() {
    this.users = new Map();
    this.dailySteps = new Map();
    this.moods = new Map();
    this.sccsScores = new Map();
    this.events = new Map();
    this.careTeamMembers = new Map();
    this.resources = new Map();
    this.userResources = new Map();
    this.chatMessages = new Map();
    this.aiInsights = new Map();
    
    this.userIdCounter = 1;
    this.dailyStepIdCounter = 1;
    this.moodIdCounter = 1;
    this.sccsScoreIdCounter = 1;
    this.eventIdCounter = 1;
    this.careTeamMemberIdCounter = 1;
    this.resourceIdCounter = 1;
    this.userResourceIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.aiInsightIdCounter = 1;
    
    // Seed some initial data
    this.seedInitialData();
  }

  // Seed initial data for testing/demo purposes
  private seedInitialData() {
    // Create a default user
    const user: User = {
      id: this.userIdCounter++,
      username: "jsmith",
      password: "password123", // In a real app, this would be hashed
      firstName: "James",
      lastName: "Smith",
      email: "james.smith@example.com",
      role: "client",
      avatarInitials: "JS",
      tier: "silver",
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    
    // Seed daily steps
    const today = new Date().toISOString().split('T')[0];
    
    this.dailySteps.set(this.dailyStepIdCounter, {
      id: this.dailyStepIdCounter++,
      userId: user.id,
      title: "Apply for the warehouse position at FlexLogistics",
      description: "Complete online application and upload resume",
      completed: false,
      dueDate: today,
      createdAt: new Date(),
    });
    
    this.dailySteps.set(this.dailyStepIdCounter, {
      id: this.dailyStepIdCounter++,
      userId: user.id,
      title: "Attend recovery support group meeting",
      description: "Downtown Community Center at 6:30 PM",
      completed: true,
      dueDate: today,
      createdAt: new Date(),
    });
    
    this.dailySteps.set(this.dailyStepIdCounter, {
      id: this.dailyStepIdCounter++,
      userId: user.id,
      title: "Schedule appointment with housing counselor",
      description: "Call Affordable Housing Initiative to discuss options",
      completed: false,
      dueDate: today,
      createdAt: new Date(),
    });
    
    // Seed mood data
    const moodTypes = ['great', 'good', 'okay', 'low', 'struggling'];
    const moodEmojis = ['😊', '🙂', '😐', '😕', '😢'];
    
    // Create 7 days of mood history
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Pick a random mood for each day
      const randomIndex = Math.floor(Math.random() * moodTypes.length);
      
      this.moods.set(this.moodIdCounter, {
        id: this.moodIdCounter++,
        userId: user.id,
        mood: moodTypes[randomIndex],
        emoji: moodEmojis[randomIndex],
        notes: "",
        date: dateStr,
        createdAt: new Date(),
      });
    }
    
    // Seed SCCS data
    this.sccsScores.set(this.sccsScoreIdCounter, {
      id: this.sccsScoreIdCounter++,
      userId: user.id,
      score: 742,
      consistency: 28,
      engagement: 19,
      milestones: 12,
      peerSupport: 22,
      date: today,
      createdAt: new Date(),
    });
    
    // Seed upcoming events
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 3);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    this.events.set(this.eventIdCounter, {
      id: this.eventIdCounter++,
      userId: user.id,
      title: "Job Readiness Workshop",
      description: "Learn interview skills and resume building techniques",
      date: tomorrowStr,
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      location: "Workforce Development Center",
      status: "upcoming",
      createdAt: new Date(),
    });
    
    this.events.set(this.eventIdCounter, {
      id: this.eventIdCounter++,
      userId: user.id,
      title: "Meeting with Sarah (CHW)",
      description: "Regular check-in to discuss progress and resources",
      date: nextWeekStr,
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      location: "Community Center (Room 203)",
      status: "confirmed",
      createdAt: new Date(),
    });
    
    // Seed care team members
    this.careTeamMembers.set(this.careTeamMemberIdCounter, {
      id: this.careTeamMemberIdCounter++,
      userId: user.id,
      teamMemberName: "Sarah Miller",
      teamMemberRole: "Community Health Worker",
      teamMemberInitials: "SM",
      contactEmail: "sarah.miller@example.com",
      contactPhone: "555-123-4567",
      createdAt: new Date(),
    });
    
    this.careTeamMembers.set(this.careTeamMemberIdCounter, {
      id: this.careTeamMemberIdCounter++,
      userId: user.id,
      teamMemberName: "James Davis",
      teamMemberRole: "Peer Mentor",
      teamMemberInitials: "JD",
      contactEmail: "james.davis@example.com",
      contactPhone: "555-987-6543",
      createdAt: new Date(),
    });
    
    // Seed resources
    this.resources.set(this.resourceIdCounter, {
      id: this.resourceIdCounter++,
      title: "Resume Building Workshop",
      description: "Free workshop to help create effective resumes for job searching.",
      category: "Employment",
      date: nextWeekStr,
      url: "https://example.com/workshop",
      readTime: "10-minute read",
      isFeatured: true,
      createdAt: new Date(),
    });
    
    this.resources.set(this.resourceIdCounter, {
      id: this.resourceIdCounter++,
      title: "Affordable Housing Guide",
      description: "Complete guide to local housing assistance programs and applications.",
      category: "Housing",
      date: null,
      readTime: "5-minute read",
      url: "https://example.com/housing-guide",
      isFeatured: true,
      createdAt: new Date(),
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      // Ensure all required fields are set with defaults if not provided
      role: insertUser.role || "client",
      email: insertUser.email || null,
      avatarInitials: insertUser.avatarInitials || null,
      tier: "bronze", 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  // Daily steps methods
  async getDailySteps(userId: number): Promise<DailyStep[]> {
    return Array.from(this.dailySteps.values()).filter(
      (step) => step.userId === userId
    );
  }
  
  async getDailyStep(id: number): Promise<DailyStep | undefined> {
    return this.dailySteps.get(id);
  }
  
  async createDailyStep(step: InsertDailyStep): Promise<DailyStep> {
    const id = this.dailyStepIdCounter++;
    const newStep: DailyStep = { 
      ...step, 
      id, 
      description: step.description || null,
      completed: step.completed || false,
      createdAt: new Date() 
    };
    this.dailySteps.set(id, newStep);
    return newStep;
  }
  
  async updateDailyStep(id: number, updates: Partial<DailyStep>): Promise<DailyStep | undefined> {
    const existingStep = this.dailySteps.get(id);
    if (!existingStep) return undefined;
    
    const updatedStep = { ...existingStep, ...updates };
    this.dailySteps.set(id, updatedStep);
    return updatedStep;
  }
  
  async deleteDailyStep(id: number): Promise<boolean> {
    return this.dailySteps.delete(id);
  }
  
  // Mood methods
  async getRecentMoods(userId: number): Promise<Mood[]> {
    return Array.from(this.moods.values())
      .filter((mood) => mood.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7); // Get up to 7 most recent moods
  }
  
  async createMood(mood: InsertMood): Promise<Mood> {
    const id = this.moodIdCounter++;
    const newMood: Mood = { 
      ...mood, 
      id, 
      notes: mood.notes || null,
      createdAt: new Date() 
    };
    this.moods.set(id, newMood);
    return newMood;
  }
  
  // SCCS methods
  async getCurrentSccsScore(userId: number): Promise<SccsScore | undefined> {
    // In a real app, would get the most recent score
    return Array.from(this.sccsScores.values())
      .filter((score) => score.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }
  
  // Events methods
  async getUpcomingEvents(userId: number): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(this.events.values())
      .filter((event) => event.userId === userId && event.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async updateEventStatus(id: number, userId: number, status: string): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event || event.userId !== userId) return undefined;
    
    const updatedEvent: Event = { ...event, status };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  // Care team methods
  async getCareTeam(userId: number): Promise<CareTeamMember[]> {
    return Array.from(this.careTeamMembers.values())
      .filter((member) => member.userId === userId);
  }
  
  // Resources methods
  async getRecommendedResources(userId: number): Promise<(Resource & { isBookmarked?: boolean })[]> {
    // Get all resources
    const allResources = Array.from(this.resources.values());
    
    // Get user bookmarks
    const userBookmarks = Array.from(this.userResources.values())
      .filter((ur) => ur.userId === userId && ur.isBookmarked);
    
    // Map of resource IDs to bookmarked status
    const bookmarkedMap = new Map<number, boolean>();
    userBookmarks.forEach((bookmark) => {
      bookmarkedMap.set(bookmark.resourceId, true);
    });
    
    // Add bookmarked status to resources
    return allResources.map((resource) => ({
      ...resource,
      isBookmarked: bookmarkedMap.has(resource.id)
    }));
  }
  
  async bookmarkResource(userResource: InsertUserResource): Promise<UserResource> {
    // Check if bookmark already exists
    const existingBookmark = Array.from(this.userResources.values()).find(
      (ur) => ur.userId === userResource.userId && ur.resourceId === userResource.resourceId
    );
    
    if (existingBookmark) {
      // Update existing bookmark
      const updatedBookmark: UserResource = { 
        ...existingBookmark, 
        // Ensure isBookmarked is not undefined
        isBookmarked: userResource.isBookmarked !== undefined ? userResource.isBookmarked : null
      };
      this.userResources.set(existingBookmark.id, updatedBookmark);
      return updatedBookmark;
    }
    
    // Create new bookmark
    const id = this.userResourceIdCounter++;
    const newUserResource: UserResource = { 
      ...userResource, 
      id, 
      // Ensure isBookmarked is not undefined
      isBookmarked: userResource.isBookmarked !== undefined ? userResource.isBookmarked : true,
      createdAt: new Date() 
    };
    this.userResources.set(id, newUserResource);
    return newUserResource;
  }
  
  async removeResourceBookmark(userId: number, resourceId: number): Promise<boolean> {
    const bookmark = Array.from(this.userResources.values()).find(
      (ur) => ur.userId === userId && ur.resourceId === resourceId
    );
    
    if (!bookmark) return false;
    
    return this.userResources.delete(bookmark.id);
  }
  
  // AI Chat methods
  async getChatMessages(userId: number, chatSessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId && msg.chatSessionId === chatSessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const newMessage: ChatMessage = {
      ...message,
      id,
      createdAt: new Date()
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
  
  // AI Insights methods
  async getLatestAiInsight(userId: number): Promise<AiInsight | undefined> {
    return Array.from(this.aiInsights.values())
      .filter(insight => insight.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }
  
  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const id = this.aiInsightIdCounter++;
    
    // Handle arrays properly
    let strengths: string[] | null = null;
    if (insight.strengthsIdentified && Array.isArray(insight.strengthsIdentified)) {
      strengths = insight.strengthsIdentified.map(item => String(item));
    }
    
    let resources: string[] | null = null;
    if (insight.suggestedResources && Array.isArray(insight.suggestedResources)) {
      resources = insight.suggestedResources.map(item => String(item));
    }
    
    const newInsight: AiInsight = {
      id,
      userId: insight.userId,
      insights: insight.insights,
      strengthsIdentified: strengths,
      suggestedResources: resources,
      createdAt: new Date()
    };
    
    this.aiInsights.set(id, newInsight);
    return newInsight;
  }
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getDailySteps(userId: number): Promise<DailyStep[]> {
    return await db.select().from(dailySteps).where(eq(dailySteps.userId, userId));
  }

  async getDailyStep(id: number): Promise<DailyStep | undefined> {
    const [step] = await db.select().from(dailySteps).where(eq(dailySteps.id, id));
    return step || undefined;
  }

  async createDailyStep(step: InsertDailyStep): Promise<DailyStep> {
    const [newStep] = await db.insert(dailySteps).values(step).returning();
    return newStep;
  }

  async updateDailyStep(id: number, updates: Partial<DailyStep>): Promise<DailyStep | undefined> {
    const [updatedStep] = await db.update(dailySteps)
      .set(updates)
      .where(eq(dailySteps.id, id))
      .returning();
    return updatedStep || undefined;
  }

  async deleteDailyStep(id: number): Promise<boolean> {
    await db.delete(dailySteps).where(eq(dailySteps.id, id));
    return true;
  }
  
  async getRecentMoods(userId: number): Promise<Mood[]> {
    return await db.select().from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(desc(moods.date))
      .limit(10);
  }

  async createMood(mood: InsertMood): Promise<Mood> {
    const [newMood] = await db.insert(moods).values(mood).returning();
    return newMood;
  }
  
  async getCurrentSccsScore(userId: number): Promise<SccsScore | undefined> {
    const [score] = await db.select().from(sccsScores)
      .where(eq(sccsScores.userId, userId))
      .orderBy(desc(sccsScores.date))
      .limit(1);
    return score || undefined;
  }
  
  async getUpcomingEvents(userId: number): Promise<Event[]> {
    return await db.select().from(events)
      .where(eq(events.userId, userId))
      .orderBy(asc(events.date));
  }

  async updateEventStatus(id: number, userId: number, status: string): Promise<Event | undefined> {
    const [updatedEvent] = await db.update(events)
      .set({ status })
      .where(and(eq(events.id, id), eq(events.userId, userId)))
      .returning();
    return updatedEvent || undefined;
  }
  
  async getCareTeam(userId: number): Promise<CareTeamMember[]> {
    return await db.select().from(careTeamMembers)
      .where(eq(careTeamMembers.userId, userId));
  }
  
  async getRecommendedResources(userId: number): Promise<(Resource & { isBookmarked?: boolean })[]> {
    const resourcesList = await db.select().from(resources);
    
    // Get user bookmarks
    const userBookmarks = await db.select()
      .from(userResources)
      .where(eq(userResources.userId, userId));
    
    const bookmarkedResourceIds = new Set(userBookmarks.map(b => b.resourceId));
    
    // Add isBookmarked flag to each resource
    return resourcesList.map(resource => ({
      ...resource,
      isBookmarked: bookmarkedResourceIds.has(resource.id)
    }));
  }

  async bookmarkResource(userResource: InsertUserResource): Promise<UserResource> {
    try {
      // Check if bookmark already exists
      const [existingBookmark] = await db.select()
        .from(userResources)
        .where(
          and(
            eq(userResources.userId, userResource.userId),
            eq(userResources.resourceId, userResource.resourceId)
          )
        );
      
      if (existingBookmark) {
        // Update existing bookmark
        const [updatedBookmark] = await db.update(userResources)
          .set({ isBookmarked: userResource.isBookmarked ?? true })
          .where(eq(userResources.id, existingBookmark.id))
          .returning();
        return updatedBookmark;
      } else {
        // Create new bookmark
        const [newBookmark] = await db.insert(userResources)
          .values(userResource)
          .returning();
        return newBookmark;
      }
    } catch (error) {
      console.error("Error in bookmarkResource:", error);
      throw error;
    }
  }

  async removeResourceBookmark(userId: number, resourceId: number): Promise<boolean> {
    await db.delete(userResources)
      .where(
        and(
          eq(userResources.userId, userId),
          eq(userResources.resourceId, resourceId)
        )
      );
    return true;
  }
  
  async getChatMessages(userId: number, chatSessionId: string): Promise<ChatMessage[]> {
    return await db.select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.userId, userId),
          eq(chatMessages.chatSessionId, chatSessionId)
        )
      )
      .orderBy(asc(chatMessages.createdAt));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }
  
  async getLatestAiInsight(userId: number): Promise<AiInsight | undefined> {
    const [insight] = await db.select()
      .from(aiInsights)
      .where(eq(aiInsights.userId, userId))
      .orderBy(desc(aiInsights.createdAt))
      .limit(1);
    return insight || undefined;
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    // Use explicit type casting for proper insert
    const insertData = {
      userId: insight.userId,
      insights: insight.insights,
      // Use empty arrays if data is missing
      strengthsIdentified: insight.strengthsIdentified || [],
      suggestedResources: insight.suggestedResources || []
    };
    
    const [newInsight] = await db.insert(aiInsights)
      .values(insertData)
      .returning();
    return newInsight;
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
