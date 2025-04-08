import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Create a connection to the database
const sql = neon(process.env.DATABASE_URL!);
// Create a drizzle client
export const db = drizzle(sql, { schema });

// Log successful connection
console.log("Database connection established");