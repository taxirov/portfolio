import type { Metadata } from "next";
import { deletePost, togglePost } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/lib/db";
import { formatDate, t } from "@/lib/i18n";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Blog" };

export default async function PostsPage() {
  await requireAdmin();
  const posts = await db.post.findMany({
    orderBy: [{ publishedAt: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }],
    select: {
      id: true,
      titleUz: true,
      titleRu: true,
      titleEn: true,
      slug: true,
      published: true,
      publishedAt: true,
      updatedAt: true,
      views: true,
      shares: true,
    },
  });

  return (
    <>
      <PageHeader title="Blog" action={{ href: "/admin/posts/new", label: "Yangi post" }} />
      {posts.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">Hali post yozilmagan.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-4 p-3 md:p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-800">
                  {t(post, "title", "uz")}
                  {!post.published && (
                    <span className="ml-2 whitespace-nowrap rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                      qoralama
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-slate-500">
                  /blogs/{post.slug}
                  {post.publishedAt && <> · {formatDate(post.publishedAt, "uz")}</>}
                  {post.published && (
                    <>
                      {" "}
                      · <i className="bi bi-eye" aria-hidden /> {post.views} · <i className="bi bi-share" aria-hidden />{" "}
                      {post.shares}
                    </>
                  )}
                </p>
              </div>
              <RowActions
                editHref={`/admin/posts/${post.id}`}
                published={post.published}
                onToggle={togglePost.bind(null, post.id, !post.published)}
                onDelete={deletePost.bind(null, post.id)}
                confirmText={`"${t(post, "title", "uz")}" postini o'chirasizmi?`}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
