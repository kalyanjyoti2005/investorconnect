import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Create postgres connection
const connectionString = process.env.DATABASE_URL!;
const queryClient = postgres(connectionString);

// Create drizzle database instance
export const db = drizzle(queryClient);