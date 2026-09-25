import "server-only";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";

/** The current page's language (the [lang] root segment) in Server Components. Unknown values 404. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!value || !hasLocale(value)) notFound();
  return value;
}

/** Language and dictionary of the current page, for Server Components under app/[lang]. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}
