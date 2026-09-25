import { isLocalPath, isSafeUrl } from "@/lib/url";

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

const BOOTSTRAP_ICON = /^(bi-)?([a-z0-9]+(-[a-z0-9]+)*)$/;

/** Category icons are Bootstrap Icons; "cloud" and "bi-cloud" both become "bi-cloud". */
export function resolveCategoryIcon(value: string) {
  const match = BOOTSTRAP_ICON.exec(value);
  return match ? `bi-${match[2]}` : null;
}
