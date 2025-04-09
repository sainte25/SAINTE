import { db } from "./db";
import { seedDatabase } from "./seed";
import * as schema from "@shared/schema";

async function resetDatabase() {
  console.log("Starting database reset...");

  try {
    // Delete all existing data in reverse order of dependencies
    await db.delete(schema.aiInsights);
    await db.delete(schema.chatMessages);
    await db.delete(schema.userResources);
    await db.delete(schema.resources);
    await db.delete(schema.careTeamMembers);
    await db.delete(schema.events);
    await db.delete(schema.moods);
    await db.delete(schema.dailySteps);
    await db.delete(schema.sccsScores);
    await db.delete(schema.users);
    
    console.log("Database successfully reset!");
    
    // Seed with fresh data
    await seedDatabase();
    
  } catch (error) {
    console.error("Error resetting database:", error);
  }
}

// Run the reset
resetDatabase();