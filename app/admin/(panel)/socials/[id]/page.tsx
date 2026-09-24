import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveSocial } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SocialForm } from "@/components/admin/social-form";
import { db } from "@/lib/db";
import { getPlatform } from "@/lib/platforms";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Havolani tahrirlash" };

export default async function EditSocialPage({ params }: PageProps<"/admin/socials/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const social = await db.socialLink.findUnique({ where: { id } });
  if (!social) notFound();

  return (
    <>
      <PageHeader title={social.label || getPlatform(social.platform).label} back="/admin/socials" />
      <SocialForm action={saveSocial.bind(null, social.id)} social={social} />
    </>
  );
}
