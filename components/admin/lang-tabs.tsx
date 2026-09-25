"use client";

import { useState, type ReactNode } from "react";
import type { FormState } from "@/app/admin/actions";
import { LOCALE_NAMES, LOCALE_SUFFIX, LOCALES, type Locale } from "@/lib/i18n";

type Props = {
  state: FormState;
  /** Base names of the translated fields inside, e.g. ["title", "description"], to flag tabs with errors. */
  fields: string[];
  children: (locale: Locale, suffix: (typeof LOCALE_SUFFIX)[Locale]) => ReactNode;
};

/**
 * One tab per language. Every tab's inputs stay in the form (inactive ones are only hidden), so a
 * single submit saves all languages. Inputs inside must not be `required`: hidden fields cannot be focused.
 */
export function LangTabs({ state, fields, children }: Props) {
  const [active, setActive] = useState<Locale>("uz");
  const hasError = (locale: Locale) => fields.some((field) => state?.fieldErrors?.[`${field}${LOCALE_SUFFIX[locale]}`]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4">
      <div role="tablist" aria-label="Til" className="flex flex-wrap gap-1">
        {LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            role="tab"
            aria-selected={locale === active}
            onClick={() => setActive(locale)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${
              locale === active ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {LOCALE_NAMES[locale]}
            {hasError(locale) && <span className="size-2 rounded-full bg-red-500" aria-label="xato bor" />}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-slate-400">
          Bo&apos;sh qolgan til o&apos;rniga boshqa tildagisi ko&apos;rsatiladi.
        </span>
      </div>
      {LOCALES.map((locale) => (
        <div key={locale} role="tabpanel" hidden={locale !== active} lang={locale} className="flex flex-col gap-5">
          {children(locale, LOCALE_SUFFIX[locale])}
        </div>
      ))}
    </div>
  );
}
