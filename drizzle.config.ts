import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load the .env file directly
dotenv.config();

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts", // Make sure this path points to your schema.ts file
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});