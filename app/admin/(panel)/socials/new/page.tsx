import type { Metadata } from "next";
import { saveSocial } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SocialForm } from "@/components/admin/social-form";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Yangi havola" };

export default async function NewSocialPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Yangi havola" back="/admin/socials" />
      <SocialForm action={saveSocial.bind(null, null)} />
    </>
  );
}
