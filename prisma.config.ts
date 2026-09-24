import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Netlify Database sets NETLIFY_DB_URL during builds, where `prisma migrate deploy` runs.
    url: process.env["DATABASE_URL"] ?? process.env["NETLIFY_DB_URL"],
    // Optional: only needed locally when the default shadow database cannot be created.
    shadowDatabaseUrl: process.env["SHADOW_DATABASE_URL"],
  },
});
