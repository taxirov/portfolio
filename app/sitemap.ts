import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/data";
import { languageAlternates, LOCALES } from "@/lib/i18n";
import { profile } from "@/lib/profile";

export const revalidate = 3600;

/** Every page in every language, each listing its translations (hreflang). */
function localized(path: string, entry: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">) {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([key, href]) => [key, `${profile.siteUrl}${href}`]),
  );
  return LOCALES.map((locale) => ({
    ...entry,
    url: `${profile.siteUrl}/${locale}${path}`,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return [
    ...localized("", { changeFrequency: "monthly", priority: 1 }),
    ...localized("/blogs", { changeFrequency: "weekly", priority: 0.8 }),
    ...localized("/domains", { changeFrequency: "monthly", priority: 0.5 }),
    ...posts.flatMap((post) =>
      localized(`/blogs/${post.slug}`, { lastModified: post.publishedAt ?? undefined, priority: 0.6 }),
    ),
  ];
}
