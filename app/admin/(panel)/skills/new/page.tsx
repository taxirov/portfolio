import type { Metadata } from "next";
import Link from "next/link";
import { saveSkill } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SkillForm } from "@/components/admin/skill-form";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Yangi ko'nikma" };

export default async function NewSkillPage({ searchParams }: PageProps<"/admin/skills/new">) {
  await requireAdmin();
  const { category } = await searchParams;
  const categories = await db.skillCategory.findMany({
    select: { id: true, title: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <>
      <PageHeader title="Yangi ko'nikma" back="/admin/skills" />
      {categories.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
          Avval{" "}
          <Link href="/admin/skills/categories/new" className="font-medium text-indigo-600 hover:underline">
            bo&apos;lim qo&apos;shing
          </Link>
          .
        </p>
      ) : (
        <SkillForm
          action={saveSkill.bind(null, null)}
          categories={categories}
          categoryId={typeof category === "string" ? category : undefined}
        />
      )}
    </>
  );
}
