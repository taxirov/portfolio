import type { Metadata } from "next";
import { PostCard } from "@/components/site/post-card";
import { getPublishedPosts } from "@/lib/data";
import { profile } from "@/lib/profile";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description: `Articles by ${profile.name} about backend development, TypeScript, Node.js and more.`,
  alternates: { canonical: "/blogs" },
};

export default async function BlogsPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">Blog</h1>
        <p className="text-lg text-slate-600">Notes on backend development, tools and things I learn.</p>
      </header>
      {posts.length === 0 ? (
        <p className="rounded-xl bg-white/60 p-6 text-slate-500">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
