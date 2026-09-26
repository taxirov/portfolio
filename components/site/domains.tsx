import Link from "next/link";
import type { Domain } from "@/lib/generated/prisma/client";
import { formatPrice } from "@/lib/domains";
import { pick } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { DomainOffer } from "./domain-offer";
import { SectionTitle } from "./section-title";

export async function DomainGrid({ domains }: { domains: Domain[] }) {
  const { locale, dict } = await getI18n();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {domains.map((domain) => {
        const description = pick(domain, "description", locale);
        return (
          <article
            key={domain.id}
            className={`flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm ${domain.sold ? "opacity-70" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="break-all text-2xl font-bold text-slate-800">{domain.name}</h3>
              {domain.sold && (
                <span className="shrink-0 rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold uppercase text-slate-600">
                  {dict.domains.sold}
                </span>
              )}
            </div>
            {description.text && (
              <p lang={description.lang} className="text-slate-600">
                {description.text}
              </p>
            )}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="font-semibold text-slate-800">
                {domain.price ? (
                  <>
                    <span className="text-sm font-normal text-slate-500">{dict.domains.price}: </span>
                    <span className="text-xl text-indigo-600">{formatPrice(domain.price, domain.currency, locale)}</span>
                  </>
                ) : (
                  <span className="text-slate-500">{dict.domains.noPrice}</span>
                )}
              </p>
              {!domain.sold && (
                <DomainOffer
                  domainId={domain.id}
                  domain={domain.name}
                  currency={domain.currency}
                  locale={locale}
                  dict={dict.domains}
                  contact={dict.contact}
                />
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/** Home page section; the full list is at /{lang}/domains. */
export async function DomainsSection({ domains, hasMore }: { domains: Domain[]; hasMore: boolean }) {
  if (domains.length === 0) return null;
  const { locale, dict } = await getI18n();
  return (
    <section id="domains" className="flex flex-col gap-4 pt-12 md:pt-24">
      <div className="flex items-end justify-between gap-4">
        <SectionTitle>{dict.domains.title}</SectionTitle>
        {hasMore && (
          <Link href={`/${locale}/domains`} className="font-semibold text-indigo-600 hover:text-indigo-700">
            {dict.domains.all} <i className="bi bi-arrow-right" aria-hidden />
          </Link>
        )}
      </div>
      <DomainGrid domains={domains} />
    </section>
  );
}
