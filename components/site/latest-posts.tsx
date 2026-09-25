import Link from "next/link";
import type { PostListItem } from "@/lib/data";
import { getI18n } from "@/lib/locale";
import { PostCard } from "./post-card";
import { SectionTitle } from "./section-title";

export async function LatestPosts({ posts }: { posts: PostListItem[] }) {
  if (posts.length === 0) return null;
  const { locale, dict } = await getI18n();

  return (
    <section id="blog" className="flex flex-col gap-4 pt-12 md:pt-24">
      <div className="flex items-end justify-between gap-4">
        <SectionTitle>{dict.blog.title}</SectionTitle>
        <Link href={`/${locale}/blogs`} className="font-semibold text-indigo-600 hover:text-indigo-700">
          {dict.blog.allPosts} <i className="bi bi-arrow-right" aria-hidden />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} readMore={dict.blog.readMore} />
        ))}
      </div>
    </section>
  );
}
