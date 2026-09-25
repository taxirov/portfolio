import type { Metadata } from "next";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./globals.css";
import { getDictionary } from "@/lib/dictionaries";
import { fontClasses } from "@/lib/fonts";
import { LOCALES } from "@/lib/i18n";

export const metadata: Metadata = { title: "404" };

// URLs that match no route at all (e.g. /de/...). The language is unknown here, so every language is shown.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontClasses}>
      <body className="flex min-h-screen items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 p-4 font-sans text-slate-800">
        <main className="flex max-w-lg flex-col items-center gap-6 text-center">
          <p className="text-7xl font-bold text-indigo-600">404</p>
          <ul className="flex flex-col gap-4">
            {LOCALES.map((locale) => {
              const dict = getDictionary(locale);
              return (
                <li key={locale} lang={locale} className="flex flex-col gap-1">
                  <p className="text-xl font-semibold">{dict.notFound.title}</p>
                  <a href={`/${locale}`} className="font-medium text-indigo-600 hover:underline">
                    {dict.notFound.home} <i className="bi bi-arrow-right" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </main>
      </body>
    </html>
  );
}
