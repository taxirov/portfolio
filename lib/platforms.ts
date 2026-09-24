export type Platform = {
  label: string;
  icon: string;
  /** Tailwind classes for the brand-coloured tile. */
  tile: string;
  /** Tailwind classes for the monochrome hero icon hover state. */
  hover: string;
};

export const PLATFORMS = {
  telegram: { label: "Telegram", icon: "bi-telegram", tile: "bg-[#0088cc]", hover: "hover:text-sky-600" },
  instagram: {
    label: "Instagram",
    icon: "bi-instagram",
    tile: "bg-[linear-gradient(45deg,#f09433,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888)]",
    hover: "hover:text-pink-600",
  },
  youtube: { label: "YouTube", icon: "bi-youtube", tile: "bg-[#c4302b]", hover: "hover:text-red-700" },
  github: { label: "GitHub", icon: "bi-github", tile: "bg-[#171515]", hover: "hover:text-black" },
  linkedin: { label: "LinkedIn", icon: "bi-linkedin", tile: "bg-[#0A66C2]", hover: "hover:text-blue-700" },
  x: { label: "X", icon: "bi-twitter-x", tile: "bg-black", hover: "hover:text-black" },
  facebook: { label: "Facebook", icon: "bi-facebook", tile: "bg-[#316FF6]", hover: "hover:text-blue-600" },
  email: { label: "Email", icon: "bi-envelope-fill", tile: "bg-indigo-500", hover: "hover:text-indigo-600" },
  website: { label: "Website", icon: "bi-globe2", tile: "bg-slate-700", hover: "hover:text-slate-900" },
  other: { label: "Link", icon: "bi-link-45deg", tile: "bg-slate-500", hover: "hover:text-slate-900" },
} satisfies Record<string, Platform>;

export type PlatformKey = keyof typeof PLATFORMS;

export const PLATFORM_KEYS = Object.keys(PLATFORMS) as PlatformKey[];

export function getPlatform(key: string): Platform {
  return PLATFORMS[key as PlatformKey] ?? PLATFORMS.other;
}
