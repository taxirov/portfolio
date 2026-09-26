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

/** Published domains, unsold first. */
export function getPublishedDomains(take?: number) {
  return safe("domains", () =>
    db.domain.findMany({
      where: { published: true },
      orderBy: [{ sold: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      take,
    }),
  );
}

/** Published skill groups that have at least one published skill. */
export async function getSkillGroups() {
  const groups = await safe("skills", () =>
    db.skillCategory.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        skills: { where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      },
    }),
  );
  return groups.filter((group) => group.skills.length > 0);
}

export type SkillGroup = Awaited<ReturnType<typeof getSkillGroups>>[number];

const postListSelect = {
  id: true,
  titleUz: true,
  titleRu: true,
  titleEn: true,
  slug: true,
  excerptUz: true,
  excerptRu: true,
  excerptEn: true,
  coverUrl: true,
  publishedAt: true,
  views: true,
} as const;

export function getPublishedPosts(take?: number) {
  return safe("posts", () =>
    db.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: postListSelect,
      take,
    }),
  );
}

export type PostListItem = Awaited<ReturnType<typeof getPublishedPosts>>[number];

export function getPublishedPost(slug: string) {
  return db.post.findFirst({ where: { slug, published: true } });
}
