import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function Dashboard() {
  await requireAdmin();
  const [
    messages,
    unread,
    posts,
    publishedPosts,
    projects,
    publishedProjects,
    skills,
    publishedSkills,
    domains,
    domainOffers,
    socials,
    publishedSocials,
  ] = await Promise.all([
    db.message.count(),
    db.message.count({ where: { read: false } }),
    db.post.count(),
    db.post.count({ where: { published: true } }),
    db.project.count(),
    db.project.count({ where: { published: true } }),
    db.skill.count(),
    db.skill.count({ where: { published: true } }),
    db.domain.count({ where: { sold: false } }),
    db.message.count({ where: { domain: { not: null } } }),
    db.socialLink.count(),
    db.socialLink.count({ where: { published: true } }),
  ]);

  const cards = [
    {
      href: "/admin/messages",
      icon: "bi-inbox",
      title: "Xabarlar",
      total: messages,
      detail: `${unread} tasi o'qilmagan`,
    },
    {
      href: "/admin/posts",
      icon: "bi-journal-text",
      title: "Blog postlari",
      total: posts,
      detail: `${publishedPosts} tasi e'lon qilingan`,
      add: "/admin/posts/new",
    },
    {
      href: "/admin/projects",
      icon: "bi-folder",
      title: "Loyihalar",
      total: projects,
      detail: `${publishedProjects} tasi saytda ko'rinadi`,
      add: "/admin/projects/new",
    },
    {
      href: "/admin/skills",
      icon: "bi-stars",
      title: "Ko'nikmalar",
      total: skills,
      detail: `${publishedSkills} tasi saytda ko'rinadi`,
      add: "/admin/skills/new",
    },
    {
      href: "/admin/domains",
      icon: "bi-globe",
      title: "Sotuvdagi domenlar",
      total: domains,
      detail: `${domainOffers} ta taklif kelgan`,
      add: "/admin/domains/new",
    },
    {
      href: "/admin/socials",
      icon: "bi-share",
      title: "Ijtimoiy tarmoqlar",
      total: socials,
      detail: `${publishedSocials} tasi saytda ko'rinadi`,
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
            <p className="text-sm text-slate-500">{card.detail}</p>
            <div className="mt-2 flex gap-2">
              <Link href={card.href} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium hover:bg-slate-200">
                Ro&apos;yxat
              </Link>
              {card.add && (
                <Link
                  href={card.add}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Yangi qo&apos;shish
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
