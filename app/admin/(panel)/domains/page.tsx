import type { Metadata } from "next";
import { deleteDomain, toggleDomain } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/domains";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Domenlar" };

export default async function DomainsPage() {
  await requireAdmin();
  const [domains, offers] = await Promise.all([
    db.domain.findMany({ orderBy: [{ sold: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
    db.message.groupBy({ by: ["domain"], where: { domain: { not: null } }, _count: true }),
  ]);
  const offerCount = new Map(offers.map((row) => [row.domain, row._count]));

  return (
    <>
      <PageHeader title="Sotuvdagi domenlar" action={{ href: "/admin/domains/new", label: "Qo'shish" }} />
      {domains.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
          Hali domen qo&apos;shilmagan. Qo&apos;shilgan domenlar saytdagi &quot;Sotuvdagi domenlar&quot; bo&apos;limida
          chiqadi.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {domains.map((domain) => {
            const offers = offerCount.get(domain.name) ?? 0;
            return (
              <li key={domain.id} className="flex items-center gap-4 p-3 md:p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-600">
                  <i className="bi bi-globe" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">
                    {domain.name}
                    {domain.sold && (
                      <span className="ml-2 whitespace-nowrap rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                        sotilgan
                      </span>
                    )}
                    {!domain.published && (
                      <span className="ml-2 whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
                        yashirin
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-500">
                    {domain.price ? formatPrice(domain.price, domain.currency, "uz") : "Narx ko'rsatilmagan"}
                    {offers > 0 && <> · {offers} ta taklif</>}
                  </p>
                </div>
                <span className="hidden text-sm text-slate-400 sm:block">#{domain.sortOrder}</span>
                <RowActions
                  editHref={`/admin/domains/${domain.id}`}
                  published={domain.published}
                  onToggle={toggleDomain.bind(null, domain.id, !domain.published)}
                  onDelete={deleteDomain.bind(null, domain.id)}
                  confirmText={`"${domain.name}" domenini o'chirasizmi? Kelgan takliflar Xabarlar bo'limida qoladi.`}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
