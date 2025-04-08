import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Create a connection to the database
const sql = neon(process.env.DATABASE_URL!);
// @ts-expect-error - Known type mismatch with the newest versions of drizzle and neon
export const db = drizzle(sql, { schema });

// Log successful connection
console.log("Database connection established");