import type { Metadata } from "next";
import { PostCard } from "@/components/site/post-card";
import { getPublishedPosts } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, languageAlternates } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[lang]/blogs">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.blog.title,
    description: dict.blog.metaDescription,
    alternates: { canonical: `/${lang}/blogs`, languages: languageAlternates("/blogs") },
  };
}

export default async function BlogsPage() {
  const [{ locale, dict }, posts] = await Promise.all([getI18n(), getPublishedPosts()]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">{dict.blog.title}</h1>
        <p className="text-lg text-slate-600">{dict.blog.intro}</p>
      </header>
      {posts.length === 0 ? (
        <p className="rounded-xl bg-white/60 p-6 text-slate-500">{dict.blog.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} locale={locale} readMore={dict.blog.readMore} />
          ))}
        </div>
      )}
    </div>
  );
}
