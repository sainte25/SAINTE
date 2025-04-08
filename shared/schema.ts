import { pgTable, text, serial, integer, boolean, timestamp, date, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  role: text("role").default("client").notNull(), // client, chw, peer_mentor, case_manager, admin
  avatarInitials: text("avatar_initials"),
  tier: text("tier").default("bronze"), // bronze, silver, gold
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  avatarInitials: true,
});

// Daily steps model
export const dailySteps = pgTable("daily_steps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  dueDate: date("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailyStepSchema = createInsertSchema(dailySteps).pick({
  userId: true,
  title: true,
  description: true,
  completed: true,
  dueDate: true,
});

// Moods model - for mood tracking
export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mood: text("mood").notNull(), // great, good, okay, low, struggling
  emoji: text("emoji").notNull(),
  notes: text("notes"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMoodSchema = createInsertSchema(moods).pick({
  userId: true,
  mood: true,
  emoji: true,
  notes: true,
  date: true,
});

// SCCS progress model
export const sccsScores = pgTable("sccs_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(),
  consistency: integer("consistency").notNull(), // out of 30
  engagement: integer("engagement").notNull(), // out of 30
  milestones: integer("milestones").notNull(), // out of 30
  peerSupport: integer("peer_support").notNull(), // out of 30
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSccsScoreSchema = createInsertSchema(sccsScores).pick({
  userId: true,
  score: true,
  consistency: true,
  engagement: true,
  milestones: true,
  peerSupport: true,
  date: true,
});

// Events model
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  location: text("location"),
  status: text("status").default("upcoming"), // upcoming, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  userId: true,
  title: true,
  description: true,
  date: true,
  startTime: true,
  endTime: true,
  location: true,
  status: true,
});

// Care team members model
export const careTeamMembers = pgTable("care_team_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // user this team member belongs to
  teamMemberName: text("team_member_name").notNull(),
  teamMemberRole: text("team_member_role").notNull(),
  teamMemberInitials: text("team_member_initials").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCareTeamMemberSchema = createInsertSchema(careTeamMembers).pick({
  userId: true,
  teamMemberName: true,
  teamMemberRole: true,
  teamMemberInitials: true,
  contactEmail: true,
  contactPhone: true,
});

// Resources model
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // employment, housing, health, education, etc.
  date: date("date"),
  url: text("url"),
  readTime: text("read_time"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  category: true,
  date: true,
  url: true,
  readTime: true,
  isFeatured: true,
});

// User resource recommendations
export const userResources = pgTable("user_resources", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  resourceId: integer("resource_id").notNull(),
  isBookmarked: boolean("is_bookmarked").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserResourceSchema = createInsertSchema(userResources).pick({
  userId: true,
  resourceId: true,
  isBookmarked: true,
});

// AI Chat messages model
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  chatSessionId: text("chat_session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  role: true,
  content: true,
  chatSessionId: true,
});

// AI Chat Insights model for storing AI-generated insights
export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  insights: text("insights").notNull(),
  strengthsIdentified: json("strengths_identified").$type<string[]>(),
  suggestedResources: json("suggested_resources").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).pick({
  userId: true,
  insights: true,
  strengthsIdentified: true,
  suggestedResources: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type DailyStep = typeof dailySteps.$inferSelect;
export type InsertDailyStep = z.infer<typeof insertDailyStepSchema>;

export type Mood = typeof moods.$inferSelect;
export type InsertMood = z.infer<typeof insertMoodSchema>;

export type SccsScore = typeof sccsScores.$inferSelect;
export type InsertSccsScore = z.infer<typeof insertSccsScoreSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type CareTeamMember = typeof careTeamMembers.$inferSelect;
export type InsertCareTeamMember = z.infer<typeof insertCareTeamMemberSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type UserResource = typeof userResources.$inferSelect;
export type InsertUserResource = z.infer<typeof insertUserResourceSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
