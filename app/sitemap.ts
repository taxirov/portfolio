import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/data";
import { profile } from "@/lib/profile";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return [
    { url: profile.siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${profile.siteUrl}/blogs`, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((post) => ({
      url: `${profile.siteUrl}/blogs/${post.slug}`,
      lastModified: post.publishedAt ?? undefined,
      priority: 0.6,
    })),
  ];
}
