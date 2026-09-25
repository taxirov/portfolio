import type { Locale } from "@/lib/i18n";
import en, { type Dictionary } from "./en";
import ru from "./ru";
import uz from "./uz";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { uz, ru, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
