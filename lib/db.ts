import { Pool } from "pg";

declare global {
  var __codePromptPool: Pool | undefined;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDbPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!global.__codePromptPool) {
    global.__codePromptPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return global.__codePromptPool;
}
