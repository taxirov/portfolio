import { getConnectionString } from "@netlify/database";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Locally DATABASE_URL points at the dev database; on Netlify, Netlify Database provides NETLIFY_DB_URL.
function connectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    return getConnectionString();
  } catch {
    // No database configured: queries fail and lib/data.ts falls back to empty lists.
    return undefined;
  }
}

function createClient() {
  const adapter = new PrismaPg({ connectionString: connectionString() });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
