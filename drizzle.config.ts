import "dotenv/config";
import assert from "node:assert";

assert(process.env.DATABASE_URL, "DATABASE_URL must be defined");

export default {
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
