"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { fill, plural, type Locale, type PluralForms } from "@/lib/i18n";

type Counts = { views: number; shares: number };

async function track(slug: string, kind: "view" | "share"): Promise<Counts | null> {
  try {
    const res = await fetch(`/api/posts/${encodeURIComponent(slug)}/stats`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind }),
      keepalive: true,
    });
    return res.ok ? ((await res.json()) as Counts) : null;
  } catch {
    return null;
  }
}

type ViewCountProps = { slug: string; initial: number; locale: Locale; forms: PluralForms };

/** Counts the visit once per tab session and shows the live view total. */
export function ViewCount({ slug, initial, locale, forms }: ViewCountProps) {
  const [views, setViews] = useState(initial);

  useEffect(() => {
    const key = `viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage can be blocked; the server still deduplicates per day.
    }
    track(slug, "view").then((counts) => counts && setViews(counts.views));
  }, [slug]);

  return (
    <span>
      <i className="bi bi-eye" aria-hidden /> {plural(forms, views, locale)}
    </span>
  );
}

const noSubscribe = () => () => {};

type ShareBarProps = {
  slug: string;
  title: string;
  url: string;
  initial: number;
  locale: Locale;
  dict: Dictionary["blog"];
};

export function ShareBar({ slug, title, url, initial, locale, dict }: ShareBarProps) {
  const [shares, setShares] = useState(initial);
  const [copied, setCopied] = useState(false);
  // The native share sheet exists mostly on phones; the server render assumes it does not.
  const canShare = useSyncExternalStore(
    noSubscribe,
    () => typeof navigator.share === "function",
    () => false,
  );

  const count = () => track(slug, "share").then((counts) => counts && setShares(counts.shares));

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const targets = [
    { name: "Telegram", icon: "bi-telegram", href: `https://t.me/share/url?url=${u}&text=${t}` },
    { name: "X", icon: "bi-twitter-x", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { name: "LinkedIn", icon: "bi-linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "Facebook", icon: "bi-facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];
  const button =
    "flex size-10 items-center justify-center rounded-full bg-white text-lg text-slate-600 shadow-sm transition hover:text-indigo-600 hover:shadow";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-slate-500">
        {dict.share} · {plural(dict.shares, shares, locale)}
      </span>
      {targets.map((target) => {
        const label = fill(dict.shareOn, { name: target.name });
        return (
          <a
            key={target.name}
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={count}
            title={label}
            aria-label={label}
            className={button}
          >
            <i className={`bi ${target.icon}`} aria-hidden />
          </a>
        );
      })}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            count();
          } catch {
            // Clipboard can be unavailable (http, old browsers); nothing to count then.
          }
        }}
        title={copied ? dict.copied : dict.copyLink}
        aria-label={dict.copyLink}
        className={button}
      >
        <i className={`bi ${copied ? "bi-check-lg text-green-600" : "bi-link-45deg"}`} aria-hidden />
      </button>
      {canShare && (
        <button
          type="button"
          onClick={() => {
            navigator.share({ title, url }).then(count, () => {
              // Cancelled by the user.
            });
          }}
          title={dict.moreOptions}
          aria-label={dict.moreOptions}
          className={button}
        >
          <i className="bi bi-share" aria-hidden />
        </button>
      )}
    </div>
  );
}
