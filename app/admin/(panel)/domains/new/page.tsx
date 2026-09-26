import type { Metadata } from "next";
import { saveDomain } from "@/app/admin/actions";
import { DomainForm } from "@/components/admin/domain-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Yangi domen" };

export default async function NewDomainPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Yangi domen" back="/admin/domains" />
      <DomainForm action={saveDomain.bind(null, null)} />
    </>
  );
}
