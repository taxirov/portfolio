import type { Metadata } from "next";
import { deleteSkill, toggleSkill } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { getSkillCategory, SKILL_CATEGORY_KEYS } from "@/lib/skills";

export const metadata: Metadata = { title: "Ko'nikmalar" };

export default async function SkillsPage() {
  await requireAdmin();
  const skills = await db.skill.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });

  // Same grouping as the home page; unknown categories go last.
  const order = (category: string) => {
    const index = SKILL_CATEGORY_KEYS.indexOf(category as (typeof SKILL_CATEGORY_KEYS)[number]);
    return index === -1 ? SKILL_CATEGORY_KEYS.length : index;
  };
  const categories = [...new Set(skills.map((skill) => skill.category))].sort((a, b) => order(a) - order(b));

  return (
    <>
      <PageHeader title="Ko'nikmalar" action={{ href: "/admin/skills/new", label: "Qo'shish" }} />
      {skills.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">Hali ko&apos;nikma qo&apos;shilmagan.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {categories.map((category) => {
            const group = getSkillCategory(category);
            return (
              <section key={category} className="flex flex-col gap-2">
                <h2 className="flex items-center gap-2 px-1 text-sm font-medium text-slate-500">
                  <i className={`bi ${group.icon}`} aria-hidden /> {group.title}
                </h2>
                <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill) => (
                      <li key={skill.id} className="flex items-center gap-4 p-3 md:p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={skill.icon} alt="" width={32} height={32} loading="lazy" className="size-8 shrink-0" />
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
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
