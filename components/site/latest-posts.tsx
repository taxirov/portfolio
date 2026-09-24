import Link from "next/link";
import type { PostListItem } from "@/lib/data";
import { PostCard } from "./post-card";
import { SectionTitle } from "./section-title";

export function LatestPosts({ posts }: { posts: PostListItem[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="flex flex-col gap-4 pt-12 md:pt-24">
      <div className="flex items-end justify-between gap-4">
        <SectionTitle>Blog</SectionTitle>
        <Link href="/blogs" className="font-semibold text-indigo-600 hover:text-indigo-700">
          All posts <i className="bi bi-arrow-right" aria-hidden />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
