import type { Metadata } from "next";
import Link from "next/link";
import {
  deleteSkill,
  deleteSkillCategory,
  toggleSkill,
  toggleSkillCategory,
} from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Ko'nikmalar" };

export default async function SkillsPage() {
  await requireAdmin();
  const categories = await db.skillCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { skills: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } },
  });

  return (
    <>
      <PageHeader title="Ko'nikmalar" action={{ href: "/admin/skills/new", label: "Ko'nikma" }} />
      <div className="flex flex-col gap-6">
        {categories.map((category) => (
          <section key={category.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <h2 className="flex min-w-0 flex-1 items-center gap-2 font-semibold text-slate-600">
                <i className={`bi ${category.icon}`} aria-hidden /> {category.title}
                <span className="text-sm font-normal text-slate-400">#{category.sortOrder}</span>
                {!category.published && (
                  <span className="whitespace-nowrap rounded bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-500">
                    yashirin
                  </span>
                )}
              </h2>
              <Link
                href={`/admin/skills/new?category=${category.id}`}
                title="Shu bo'limga ko'nikma qo'shish"
                aria-label="Shu bo'limga ko'nikma qo'shish"
                className="rounded-md p-2 text-slate-500 hover:bg-white hover:text-indigo-600"
              >
                <i className="bi bi-plus-lg" aria-hidden />
              </Link>
              <RowActions
                editHref={`/admin/skills/categories/${category.id}`}
                published={category.published}
                onToggle={toggleSkillCategory.bind(null, category.id, !category.published)}
                onDelete={deleteSkillCategory.bind(null, category.id)}
                confirmText={`"${category.title}" bo'limini o'chirasizmi?`}
              />
            </div>
            {category.skills.length === 0 ? (
              <p className="rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-sm">Bu bo&apos;lim bo&apos;sh.</p>
            ) : (
              <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
                {category.skills.map((skill) => (
                  <li key={skill.id} className="flex items-center gap-4 p-3 md:p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={skill.icon} alt="" width={32} height={32} className="size-8 shrink-0" />
                    <p className="min-w-0 flex-1 font-semibold text-slate-800">
                      {skill.name}
                      {!skill.published && (
                        <span className="ml-2 whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
                          yashirin
                        </span>
                      )}
                    </p>
                    <span className="hidden text-sm text-slate-400 sm:block">#{skill.sortOrder}</span>
                    <RowActions
                      editHref={`/admin/skills/${skill.id}`}
                      published={skill.published}
                      onToggle={toggleSkill.bind(null, skill.id, !skill.published)}
                      onDelete={deleteSkill.bind(null, skill.id)}
                      confirmText={`"${skill.name}" ko'nikmasini o'chirasizmi?`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <Link
          href="/admin/skills/categories/new"
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-4 font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600"
        >
          <i className="bi bi-plus-lg" aria-hidden /> Yangi bo&apos;lim
        </Link>
      </div>
    </>
  );
}
