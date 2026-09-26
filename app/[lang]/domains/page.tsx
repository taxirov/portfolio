import type { Metadata } from "next";
import { DomainGrid } from "@/components/site/domains";
import { getPublishedDomains } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, languageAlternates } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[lang]/domains">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.domains.title,
    description: dict.domains.metaDescription,
    alternates: { canonical: `/${lang}/domains`, languages: languageAlternates("/domains") },
  };
}

export default async function DomainsPage() {
  const [{ dict }, domains] = await Promise.all([getI18n(), getPublishedDomains()]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">{dict.domains.title}</h1>
        <p className="text-lg text-slate-600">{dict.domains.intro}</p>
      </header>
      {domains.length === 0 ? (
        <p className="rounded-xl bg-white/60 p-6 text-slate-500">{dict.domains.empty}</p>
      ) : (
        <DomainGrid domains={domains} />
      )}
    </div>
  );
}
