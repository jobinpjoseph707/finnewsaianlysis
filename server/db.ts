import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Initialize Postgres connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

// Initialize Drizzle with the Postgres connection and our schemas
export const db = drizzle(client, { schema });

// Export for direct use
export { client };