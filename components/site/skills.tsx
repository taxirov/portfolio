import type { Skill } from "@/lib/generated/prisma/client";
import { SKILL_CATEGORIES, SKILL_CATEGORY_KEYS } from "@/lib/skills";
import { SectionTitle } from "./section-title";

export function Skills({ skills }: { skills: Skill[] }) {
  const groups = SKILL_CATEGORY_KEYS.map((key) => ({
    key,
    ...SKILL_CATEGORIES[key],
    skills: skills.filter((skill) => skill.category === key),
  })).filter((group) => group.skills.length > 0);

  if (groups.length === 0) return null;

  return (
    <section id="skills" className="flex flex-col gap-4 pt-12 md:pt-24">
      <SectionTitle>Skills</SectionTitle>
      {groups.map((group) => (
        <div
          key={group.key}
          className="flex flex-col gap-3 rounded-2xl bg-gradient-to-b from-stone-50 to-white p-4 shadow-md"
        >
          <h3 className="text-lg text-slate-500">
            <i className={`bi ${group.icon}`} aria-hidden /> {group.title}
          </h3>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {group.skills.map((skill) => (
              <li key={skill.id} className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 shadow-sm">
                {/* Remote SVG icons: next/image would add nothing here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={skill.icon} alt="" width={32} height={32} loading="lazy" className="size-7 sm:size-8" />
                <span className="font-semibold text-slate-700 sm:text-lg">{skill.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
