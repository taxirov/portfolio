import { isLocalPath, isSafeUrl } from "@/lib/url";

/** Skill groups shown on the home page, in this order. Skills themselves live in the database. */
export const SKILL_CATEGORIES = {
  languages: { title: "Programming languages", icon: "bi-translate" },
  backend: { title: "Backend", icon: "bi-hdd-stack" },
  frontend: { title: "Frontend", icon: "bi-window" },
  tools: { title: "Tools", icon: "bi-wrench-adjustable-circle" },
  infrastructure: { title: "Infrastructure", icon: "bi-cloud" },
  learning: { title: "Learning now", icon: "bi-broadcast" },
} satisfies Record<string, { title: string; icon: string }>;

export type SkillCategoryKey = keyof typeof SKILL_CATEGORIES;

export const SKILL_CATEGORY_KEYS = Object.keys(SKILL_CATEGORIES) as SkillCategoryKey[];

export function getSkillCategory(key: string) {
  return SKILL_CATEGORIES[key as SkillCategoryKey] ?? { title: key, icon: "bi-tag" };
}

export const devicon = (name: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;

const DEVICON_NAME = /^[a-z0-9]+$/;

/**
 * The admin form accepts a devicon name ("docker"), a full https URL or a site path.
 * Returns the icon URL to store, or null when the value is none of those.
 */
export function resolveSkillIcon(value: string) {
  if (DEVICON_NAME.test(value)) return devicon(value);
  if (isSafeUrl(value) || isLocalPath(value)) return value;
  return null;
}
