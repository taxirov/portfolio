import type { Metadata } from "next";
import { saveSkillCategory } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SkillCategoryForm } from "@/components/admin/skill-category-form";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Yangi bo'lim" };

export default async function NewSkillCategoryPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Yangi bo'lim" back="/admin/skills" />
      <SkillCategoryForm action={saveSkillCategory.bind(null, null)} />
    </>
  );
}
