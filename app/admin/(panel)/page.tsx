import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function Dashboard() {
  await requireAdmin();
  const [projects, publishedProjects, socials, publishedSocials] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { published: true } }),
    db.socialLink.count(),
    db.socialLink.count({ where: { published: true } }),
  ]);

  const cards = [
    {
      href: "/admin/projects",
      icon: "bi-folder",
      title: "Loyihalar",
      total: projects,
      published: publishedProjects,
      add: "/admin/projects/new",
    },
    {
      href: "/admin/socials",
      icon: "bi-share",
      title: "Ijtimoiy tarmoqlar",
      total: socials,
      published: publishedSocials,
      add: "/admin/socials/new",
    },
  ];

  return (
    <>
      <PageHeader title="Bosh sahifa" />
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.href} className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <i className={`bi ${card.icon}`} aria-hidden /> {card.title}
            </div>
            <p className="text-4xl font-semibold text-slate-800">{card.total}</p>
            <p className="text-sm text-slate-500">{card.published} tasi saytda ko&apos;rinadi</p>
            <div className="mt-2 flex gap-2">
              <Link href={card.href} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium hover:bg-slate-200">
                Ro&apos;yxat
              </Link>
              <Link
                href={card.add}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Yangi qo&apos;shish
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
