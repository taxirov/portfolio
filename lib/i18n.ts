/** Site languages, in the order the switcher shows them. */
export const LOCALES = ["uz", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Used when the browser language is none of the above. */
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "lang";

/** Each language's name written in that language, for the switcher and hreflang notes. */
export const LOCALE_NAMES: Record<Locale, string> = { uz: "O'zbekcha", ru: "Русский", en: "English" };

/** hreflang links for a path under every language, e.g. languageAlternates("/blogs"). */
export function languageAlternates(path = "") {
  return {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}${path}`])),
    "x-default": `/${DEFAULT_LOCALE}${path}`,
  };
}

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Column suffix of each language: titleUz, titleRu, titleEn. */
export const LOCALE_SUFFIX = { uz: "Uz", ru: "Ru", en: "En" } as const satisfies Record<Locale, string>;

type Suffix = (typeof LOCALE_SUFFIX)[Locale];
type Translated<F extends string> = Record<`${F}${Suffix}`, string | null>;

/**
 * Reads a translated field such as titleUz / titleRu / titleEn. An empty translation falls back
 * to English, then Uzbek, then Russian, so partly translated content still shows something.
 * `lang` is the language actually returned, for the lang attribute and "only in English" notes.
 */
export function pick<F extends string>(record: Translated<F>, field: F, locale: Locale) {
  for (const candidate of [locale, "en", "uz", "ru"] as const) {
    const value = record[`${field}${LOCALE_SUFFIX[candidate]}` as `${F}${Suffix}`];
    if (value) return { text: value, lang: candidate };
  }
  return { text: "", lang: locale };
}

/** Shorthand for pick(...).text */
export function t<F extends string>(record: Translated<F>, field: F, locale: Locale) {
  return pick(record, field, locale).text;
}

const INTL_LOCALE: Record<Locale, string> = { uz: "uz-Latn-UZ", ru: "ru-RU", en: "en-GB" };

export function formatDate(date: Date | null, locale: Locale) {
  return date
    ? new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "long", timeZone: "Asia/Tashkent" }).format(date)
    : "";
}

export function formatCount(value: number, locale: Locale) {
  return new Intl.NumberFormat(INTL_LOCALE[locale], { notation: "compact" }).format(value);
}

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** "1 view" / "2 views", "1 просмотр" / "3 просмотра" / "5 просмотров" */
export function plural(forms: PluralForms, count: number, locale: Locale) {
  const rule = new Intl.PluralRules(INTL_LOCALE[locale]).select(count);
  return `${formatCount(count, locale)} ${forms[rule] ?? forms.other}`;
}

/** Replaces {name} placeholders. */
export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/** Picks the best supported language from an Accept-Language header. */
export function matchLocale(acceptLanguage: string | null): Locale | null {
  if (!acceptLanguage) return null;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { base: tag.trim().toLowerCase().split("-")[0], q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q);
  return ranked.map((entry) => entry.base).find(hasLocale) ?? null;
}
