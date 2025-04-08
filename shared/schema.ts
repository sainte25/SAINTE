import { pgTable, text, serial, integer, boolean, timestamp, date, json, foreignKey, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Define possible roles based on document
export type UserRole = 
  | "client"
  | "peer_mentor"
  | "community_health_worker" 
  | "case_manager"
  | "supervisor"
  | "primary_care_provider"
  | "external_partner"
  | "admin";

// Organization types
export type OrganizationType = 
  | "reentry"
  | "housing"
  | "health_system"
  | "behavioral_health"
  | "workforce"
  | "other";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: text("role").$type<UserRole>().default("client").notNull(),
  avatarInitials: text("avatar_initials"),
  tier: text("tier").default("bronze"), // bronze, silver, gold
  organization: text("organization"),
  organizationType: text("organization_type").$type<OrganizationType>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  dailySteps: many(dailySteps),
  moods: many(moods),
  sccsScores: many(sccsScores),
  events: many(events),
  careTeamMembers: many(careTeamMembers),
  userResources: many(userResources),
  chatMessages: many(chatMessages),
  aiInsights: many(aiInsights),
  mindsetAssessments: many(mindsetAssessments),
  shameDisruptionLogs: many(shameDisruptionLogs),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
  avatarInitials: true,
  organization: true,
  organizationType: true,
});

// Daily steps model
export const dailySteps = pgTable("daily_steps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  dueDate: date("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("daily_steps_user_id_idx").on(table.userId),
  }
});

export const dailyStepsRelations = relations(dailySteps, ({ one }) => ({
  user: one(users, {
    fields: [dailySteps.userId],
    references: [users.id],
  }),
}));

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
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mood: text("mood").notNull(), // great, good, okay, low, struggling
  emoji: text("emoji").notNull(),
  notes: text("notes"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("moods_user_id_idx").on(table.userId),
    dateIdx: index("moods_date_idx").on(table.date),
  }
});

export const moodsRelations = relations(moods, ({ one }) => ({
  user: one(users, {
    fields: [moods.userId],
    references: [users.id],
  }),
}));

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
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  consistency: integer("consistency").notNull(), // out of 30
  engagement: integer("engagement").notNull(), // out of 30
  milestones: integer("milestones").notNull(), // out of 30
  peerSupport: integer("peer_support").notNull(), // out of 30
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("sccs_scores_user_id_idx").on(table.userId),
    dateIdx: index("sccs_scores_date_idx").on(table.date),
  }
});

export const sccsScoresRelations = relations(sccsScores, ({ one }) => ({
  user: one(users, {
    fields: [sccsScores.userId],
    references: [users.id],
  }),
}));

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
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  location: text("location"),
  status: text("status").default("upcoming"), // upcoming, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("events_user_id_idx").on(table.userId),
    dateIdx: index("events_date_idx").on(table.date),
  }
});

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
}));

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
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), // user this team member belongs to
  teamMemberName: text("team_member_name").notNull(),
  teamMemberRole: text("team_member_role").notNull(),
  teamMemberInitials: text("team_member_initials").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("care_team_members_user_id_idx").on(table.userId),
  }
});

export const careTeamMembersRelations = relations(careTeamMembers, ({ one }) => ({
  user: one(users, {
    fields: [careTeamMembers.userId],
    references: [users.id],
  }),
}));

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
}, (table) => {
  return {
    categoryIdx: index("resources_category_idx").on(table.category),
  }
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
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  resourceId: integer("resource_id").notNull().references(() => resources.id, { onDelete: "cascade" }),
  isBookmarked: boolean("is_bookmarked").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userResourceIdx: uniqueIndex("user_resource_idx").on(table.userId, table.resourceId),
  }
});

export const userResourcesRelations = relations(userResources, ({ one }) => ({
  user: one(users, {
    fields: [userResources.userId],
    references: [users.id],
  }),
  resource: one(resources, {
    fields: [userResources.resourceId],
    references: [resources.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ many }) => ({
  userResources: many(userResources),
}));

export const insertUserResourceSchema = createInsertSchema(userResources).pick({
  userId: true,
  resourceId: true,
  isBookmarked: true,
});

// AI Chat messages model
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  chatSessionId: text("chat_session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    sessionIdx: index("chat_messages_session_idx").on(table.chatSessionId),
    userIdIdx: index("chat_messages_user_id_idx").on(table.userId),
  }
});

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  role: true,
  content: true,
  chatSessionId: true,
});

// AI Chat Insights model for storing AI-generated insights
export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  insights: text("insights").notNull(),
  strengthsIdentified: json("strengths_identified").$type<string[]>(),
  suggestedResources: json("suggested_resources").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("ai_insights_user_id_idx").on(table.userId),
  }
});

export const aiInsightsRelations = relations(aiInsights, ({ one }) => ({
  user: one(users, {
    fields: [aiInsights.userId],
    references: [users.id],
  }),
}));

export const insertAiInsightSchema = createInsertSchema(aiInsights).pick({
  userId: true,
  insights: true,
  strengthsIdentified: true,
  suggestedResources: true,
});

// Mindset Assessment model
export const mindsetAssessments = pgTable("mindset_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  purposeStatement: text("purpose_statement"),
  passionTags: json("passion_tags").$type<string[]>(),
  shameReframeJournal: json("shame_reframe_journal").$type<string[]>(),
  growthCheckpoints: json("growth_checkpoints").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("mindset_assessments_user_id_idx").on(table.userId),
  }
});

export const mindsetAssessmentsRelations = relations(mindsetAssessments, ({ one }) => ({
  user: one(users, {
    fields: [mindsetAssessments.userId],
    references: [users.id],
  }),
}));

export const insertMindsetAssessmentSchema = createInsertSchema(mindsetAssessments).pick({
  userId: true,
  purposeStatement: true,
  passionTags: true,
  shameReframeJournal: true,
  growthCheckpoints: true,
});

// Shame Disruption System
export const shameDisruptionLogs = pgTable("shame_disruption_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  signalType: text("signal_type").notNull(), // behavior, text, avoidance, emotional
  detectedBy: text("detected_by").notNull(), // AI_chat, NLP_text_scan, system_flag
  interventionUsed: text("intervention_used"), // reflection, journaling, breathwork
  resolved: boolean("resolved").default(false),
  feedback: text("feedback"), // Was this helpful?
  sharedWithTeam: boolean("shared_with_team").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("shame_disruption_logs_user_id_idx").on(table.userId),
  }
});

export const shameDisruptionLogsRelations = relations(shameDisruptionLogs, ({ one }) => ({
  user: one(users, {
    fields: [shameDisruptionLogs.userId],
    references: [users.id],
  }),
}));

export const insertShameDisruptionLogSchema = createInsertSchema(shameDisruptionLogs).pick({
  userId: true,
  signalType: true,
  detectedBy: true,
  interventionUsed: true,
  resolved: true,
  feedback: true,
  sharedWithTeam: true,
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

export type MindsetAssessment = typeof mindsetAssessments.$inferSelect;
export type InsertMindsetAssessment = z.infer<typeof insertMindsetAssessmentSchema>;

export type ShameDisruptionLog = typeof shameDisruptionLogs.$inferSelect;
export type InsertShameDisruptionLog = z.infer<typeof insertShameDisruptionLogSchema>;
