import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveSkillCategory } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SkillCategoryForm } from "@/components/admin/skill-category-form";
import { db } from "@/lib/db";
import { t } from "@/lib/i18n";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Bo'limni tahrirlash" };

export default async function EditSkillCategoryPage({ params }: PageProps<"/admin/skills/categories/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const category = await db.skillCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <>
      <PageHeader title={t(category, "title", "uz")} back="/admin/skills" />
      <SkillCategoryForm action={saveSkillCategory.bind(null, category.id)} category={category} />
    </>
  );
}
