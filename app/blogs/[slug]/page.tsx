import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Markdown } from "@/components/markdown";
import { formatDate } from "@/components/site/post-card";
import { getPublishedPost, getPublishedPosts } from "@/lib/data";
import { profile } from "@/lib/profile";
import { isOptimizableImage } from "@/lib/url";

export const revalidate = 300;

// Shared between generateMetadata and the page within one render.
const loadPost = cache((slug: string) => getPublishedPost(slug));

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [profile.name],
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blogs/[slug]">) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link href="/blogs" className="w-fit text-sm font-medium text-slate-500 hover:text-indigo-600">
        <i className="bi bi-arrow-left" aria-hidden /> All posts
      </Link>
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold leading-tight text-slate-800 md:text-5xl">{post.title}</h1>
        <p className="text-slate-500">
          {profile.name} · <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
        </p>
      </header>
      {post.coverUrl && (
        <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-slate-200">
          <Image
            src={post.coverUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            unoptimized={!isOptimizableImage(post.coverUrl)}
            className="object-cover"
          />
        </div>
      )}
      <div className="rounded-2xl bg-white p-5 shadow-sm md:p-8">
        <Markdown>{post.content}</Markdown>
      </div>
      <Link
        href="/#contact"
        className="w-fit rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
      >
        <i className="bi bi-chat-dots" aria-hidden /> Get in touch
      </Link>
    </article>
  );
}
