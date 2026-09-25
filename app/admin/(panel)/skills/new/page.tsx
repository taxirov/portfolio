import type { Metadata } from "next";
import { saveSkill } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SkillForm } from "@/components/admin/skill-form";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Yangi ko'nikma" };

export default async function NewSkillPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Yangi ko'nikma" back="/admin/skills" />
      <SkillForm action={saveSkill.bind(null, null)} />
    </>
  );
}
