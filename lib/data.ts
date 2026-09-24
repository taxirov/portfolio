import "server-only";
import { db } from "@/lib/db";

// Public pages must still render when the database is unreachable (e.g. a local build without
// DATABASE_URL), so reads fall back to empty lists and the page revalidates later.
async function safe<T>(label: string, query: () => Promise<T[]>): Promise<T[]> {
  try {
    return await query();
  } catch (error) {
    console.error(`[data] failed to load ${label}:`, error);
    return [];
  }
}

export function getPublishedProjects() {
  return safe("projects", () =>
    db.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  );
}

export function getPublishedSocials() {
  return safe("social links", () =>
    db.socialLink.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  );
}
