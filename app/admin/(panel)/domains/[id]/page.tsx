import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveDomain } from "@/app/admin/actions";
import { DomainForm } from "@/components/admin/domain-form";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Domenni tahrirlash" };

export default async function EditDomainPage({ params }: PageProps<"/admin/domains/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const domain = await db.domain.findUnique({ where: { id } });
  if (!domain) notFound();

  return (
    <>
      <PageHeader title={domain.name} back="/admin/domains" />
      <DomainForm action={saveDomain.bind(null, domain.id)} domain={domain} />
    </>
  );
}
