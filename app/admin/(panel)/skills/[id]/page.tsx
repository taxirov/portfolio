import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveSkill } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SkillForm } from "@/components/admin/skill-form";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Ko'nikmani tahrirlash" };

export default async function EditSkillPage({ params }: PageProps<"/admin/skills/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [skill, categories] = await Promise.all([
    db.skill.findUnique({ where: { id } }),
    db.skillCategory.findMany({ select: { id: true, title: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
  ]);
  if (!skill) notFound();

  return (
    <>
      <PageHeader title={skill.name} back="/admin/skills" />
      <SkillForm action={saveSkill.bind(null, skill.id)} skill={skill} categories={categories} />
    </>
  );
}
