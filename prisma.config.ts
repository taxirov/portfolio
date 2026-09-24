import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a direct connection; Neon's pooled DATABASE_URL goes through PgBouncer.
    url: process.env["DATABASE_URL_UNPOOLED"] ?? process.env["DATABASE_URL"],
    // Optional: only needed locally when the default shadow database cannot be created.
    shadowDatabaseUrl: process.env["SHADOW_DATABASE_URL"],
  },
});
