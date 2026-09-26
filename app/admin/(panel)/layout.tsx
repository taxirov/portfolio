import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { profile } from "@/lib/profile";
import { requireAdmin } from "@/lib/session";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  const unread = await db.message.count({ where: { read: false } });

  const nav = [
    { href: "/admin", label: "Bosh sahifa", icon: "bi-speedometer2" },
    { href: "/admin/messages", label: "Xabarlar", icon: "bi-inbox", badge: unread },
    { href: "/admin/posts", label: "Blog", icon: "bi-journal-text" },
    { href: "/admin/projects", label: "Loyihalar", icon: "bi-folder" },
    { href: "/admin/skills", label: "Ko'nikmalar", icon: "bi-stars" },
    { href: "/admin/domains", label: "Domenlar", icon: "bi-globe" },
    { href: "/admin/socials", label: "Ijtimoiy tarmoqlar", icon: "bi-share" },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-4 md:flex-row md:p-8">
      <aside className="flex shrink-0 flex-col gap-4 md:w-56">
        <div className="flex items-center gap-3">
          <Image src="/images/avatar.webp" alt="" width={36} height={36} className="rounded-full" />
          <span className="font-semibold">Admin panel</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-white"
            >
              <i className={`bi ${item.icon}`} aria-hidden /> {item.label}
              {!!item.badge && (
                <span className="ml-auto rounded-full bg-indigo-600 px-2 text-xs font-semibold leading-5 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="flex gap-1 border-slate-200 md:mt-auto md:flex-col md:border-t md:pt-4">
          <a
            href={profile.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white"
          >
            <i className="bi bi-box-arrow-up-right" aria-hidden /> Saytni ochish
          </a>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-red-600"
            >
              <i className="bi bi-box-arrow-left" aria-hidden /> Chiqish
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
