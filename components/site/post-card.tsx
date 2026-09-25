import Image from "next/image";
import Link from "next/link";
import type { PostListItem } from "@/lib/data";
import { formatDate, pick, t, type Locale } from "@/lib/i18n";
import { isOptimizableImage } from "@/lib/url";

export function PostCard({ post, locale, readMore }: { post: PostListItem; locale: Locale; readMore: string }) {
  const excerpt = pick(post, "excerpt", locale);
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/${locale}/blogs/${post.slug}`} className="flex flex-1 flex-col">
        {post.coverUrl && (
          <div className="relative aspect-[2/1] bg-slate-100">
            <Image
              src={post.coverUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              unoptimized={!isOptimizableImage(post.coverUrl)}
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-sm text-slate-500">
            <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt, locale)}</time>
            {post.views > 0 && (
              <>
                {" "}
                · <i className="bi bi-eye" aria-hidden /> {post.views}
              </>
            )}
          </p>
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600">
            {t(post, "title", locale)}
          </h3>
          {excerpt.text && (
            <p lang={excerpt.lang} className="text-slate-600">
              {excerpt.text}
            </p>
          )}
          <span className="mt-auto pt-2 text-sm font-semibold text-indigo-600">
            {readMore} <i className="bi bi-arrow-right" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
