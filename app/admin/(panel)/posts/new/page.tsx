import type { Metadata } from "next";
import { savePost } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Yangi post" };

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Yangi post" back="/admin/posts" />
      <PostForm action={savePost.bind(null, null)} />
    </>
  );
}
