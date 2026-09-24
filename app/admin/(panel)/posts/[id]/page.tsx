import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { savePost } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/post-form";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Postni tahrirlash" };

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <PageHeader title={post.title} back="/admin/posts" />
      <PostForm action={savePost.bind(null, post.id)} post={post} />
    </>
  );
}
