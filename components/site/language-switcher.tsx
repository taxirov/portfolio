"use client";

import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n";

/** Links to the current page in every language; the choice is remembered for visits to saad.uz/. */
export function LanguageSwitcher({ locale, label, className = "" }: { locale: Locale; label: string; className?: string }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "");

  return (
    <nav aria-label={label} className={`flex items-center gap-0.5 rounded-lg bg-white/60 p-0.5 text-sm ${className}`}>
      {LOCALES.map((option) => (
        <a
          key={option}
          href={`/${option}${rest}`}
          hrefLang={option}
          lang={option}
          title={LOCALE_NAMES[option]}
          aria-current={option === locale ? "true" : undefined}
          onClick={(event) => {
            document.cookie = `${LOCALE_COOKIE}=${option}; path=/; max-age=31536000; samesite=lax`;
            // Keep the section the reader was looking at.
            event.currentTarget.href = `/${option}${rest}${window.location.hash}`;
          }}
          className={`rounded-md px-2 py-1 font-semibold uppercase transition-colors ${
            option === locale ? "bg-indigo-500 text-white" : "text-slate-600 hover:text-indigo-600"
          }`}
        >
          {option}
        </a>
      ))}
    </nav>
  );
}
