import type { Metadata } from "next";
import { deleteSocial, toggleSocial } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/lib/db";
import { getPlatform } from "@/lib/platforms";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Ijtimoiy tarmoqlar" };

export default async function SocialsPage() {
  await requireAdmin();
  const socials = await db.socialLink.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });

  return (
    <>
      <PageHeader title="Ijtimoiy tarmoqlar" action={{ href: "/admin/socials/new", label: "Qo'shish" }} />
      {socials.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">Hali havola qo&apos;shilmagan.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {socials.map((social) => {
            const platform = getPlatform(social.platform);
            return (
              <li key={social.id} className="flex items-center gap-4 p-3 md:p-4">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-xl text-white ${platform.tile}`}
                >
                  <i className={`bi ${platform.icon}`} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">
                    {social.label || platform.label}
                    {social.showInHero && (
                      <span className="ml-2 whitespace-nowrap rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-600">
                        bosh ekran
                      </span>
                    )}
                    {!social.published && (
                      <span className="ml-2 whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
                        yashirin
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-slate-500">{social.url}</p>
                </div>
                <span className="hidden text-sm text-slate-400 sm:block">#{social.sortOrder}</span>
                <RowActions
                  editHref={`/admin/socials/${social.id}`}
                  published={social.published}
                  onToggle={toggleSocial.bind(null, social.id, !social.published)}
                  onDelete={deleteSocial.bind(null, social.id)}
                  confirmText={`"${social.label || platform.label}" havolasini o'chirasizmi?`}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
