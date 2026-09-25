import Image from "next/image";
import Link from "next/link";
import type { PostListItem } from "@/lib/data";
import { isOptimizableImage } from "@/lib/url";

export function formatDate(date: Date | null) {
  return date ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Asia/Tashkent" }).format(date) : "";
}

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/blogs/${post.slug}`} className="flex flex-1 flex-col">
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
            <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
            {post.views > 0 && (
              <>
                {" "}
                · <i className="bi bi-eye" aria-hidden /> {post.views}
              </>
            )}
          </p>
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600">{post.title}</h3>
          {post.excerpt && <p className="text-slate-600">{post.excerpt}</p>}
          <span className="mt-auto pt-2 text-sm font-semibold text-indigo-600">
            Read more <i className="bi bi-arrow-right" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
