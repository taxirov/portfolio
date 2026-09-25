import type { Metadata } from "next";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "../globals.css";
import { getDictionary } from "@/lib/dictionaries";
import { fontClasses } from "@/lib/fonts";
import { hasLocale, languageAlternates, LOCALES } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { profile } from "@/lib/profile";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL(profile.siteUrl),
    title: { default: dict.meta.title, template: `%s | ${profile.name}` },
    description: dict.meta.description,
    alternates: { canonical: `/${lang}`, languages: languageAlternates() },
    openGraph: {
      type: "website",
      url: `${profile.siteUrl}/${lang}`,
      siteName: profile.name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: dict.meta.ogLocale,
    },
    twitter: { card: "summary_large_image" },
    verification: { google: "04qTKJSrbVBgbGgqDparm9uJlWbZTnAgil2hPIBtc5k" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={fontClasses}>
      <body className="min-h-screen font-sans text-slate-800">{children}</body>
    </html>
  );
}
