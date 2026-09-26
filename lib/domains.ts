import type { Locale } from "@/lib/i18n";

export const CURRENCIES = ["USD", "UZS"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** example.uz, my-shop.com, sub.example.co.uk (ASCII only; enter IDNs in punycode). */
export const DOMAIN_PATTERN = /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/** "  HTTPS://Example.UZ/ " -> "example.uz" */
export function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

const INTL_LOCALE: Record<Locale, string> = { uz: "uz-Latn-UZ", ru: "ru-RU", en: "en-US" };

/** "$1,500", "1 500 $", "15 000 000 soʻm" */
export function formatPrice(amount: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
