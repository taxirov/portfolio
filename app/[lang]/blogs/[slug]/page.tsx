import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Markdown } from "@/components/markdown";
import { ShareBar, ViewCount } from "@/components/site/post-stats";
import { getPublishedPost, getPublishedPosts } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { fill, formatDate, hasLocale, languageAlternates, LOCALE_NAMES, pick, t } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { profile } from "@/lib/profile";
import { isOptimizableImage } from "@/lib/url";

export const revalidate = 300;

// Shared between generateMetadata and the page within one render.
const loadPost = cache((slug: string) => getPublishedPost(slug));

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blogs/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await loadPost(slug);
  if (!post || !hasLocale(lang)) return {};
  const title = t(post, "title", lang);
  const description = t(post, "excerpt", lang) || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/${lang}/blogs/${post.slug}`, languages: languageAlternates(`/blogs/${post.slug}`) },
    openGraph: {
      type: "article",
      title,
      description,
      locale: getDictionary(lang).meta.ogLocale,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [profile.name],
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    },
  };
}

export default async function PostPage({ params }: PageProps<"/[lang]/blogs/[slug]">) {
  const { slug } = await params;
  const [{ locale, dict }, post] = await Promise.all([getI18n(), loadPost(slug)]);
  if (!post) notFound();

  const title = pick(post, "title", locale);
  const content = pick(post, "content", locale);

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link href={`/${locale}/blogs`} className="w-fit text-sm font-medium text-slate-500 hover:text-indigo-600">
        <i className="bi bi-arrow-left" aria-hidden /> {dict.blog.allPosts}
      </Link>
      <header className="flex flex-col gap-3">
        <h1 lang={title.lang} className="text-3xl font-bold leading-tight text-slate-800 md:text-5xl">
          {title.text}
        </h1>
        <p className="text-slate-500">
          {profile.name} ·{" "}
          <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt, locale)}</time> ·{" "}
          <ViewCount slug={post.slug} initial={post.views} locale={locale} forms={dict.blog.views} />
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
      {content.lang !== locale && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <i className="bi bi-translate" aria-hidden /> {fill(dict.blog.onlyIn, { language: LOCALE_NAMES[content.lang] })}
        </p>
      )}
      <div lang={content.lang} className="rounded-2xl bg-white p-5 shadow-sm md:p-8">
        <Markdown>{content.text}</Markdown>
      </div>
      <ShareBar
        slug={post.slug}
        title={title.text}
        url={`${profile.siteUrl}/${locale}/blogs/${post.slug}`}
        initial={post.shares}
        locale={locale}
        dict={dict.blog}
      />
      <Link
        href={`/${locale}#contact`}
        className="w-fit rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
      >
        <i className="bi bi-chat-dots" aria-hidden /> {dict.blog.getInTouch}
      </Link>
    </article>
  );
}
