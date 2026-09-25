"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Counts = { views: number; shares: number };

const compact = new Intl.NumberFormat("en", { notation: "compact" });

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

/** Counts the visit once per tab session and shows the live view total. */
export function ViewCount({ slug, initial }: { slug: string; initial: number }) {
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
    <span title={`${views} views`}>
      <i className="bi bi-eye" aria-hidden /> {compact.format(views)} {views === 1 ? "view" : "views"}
    </span>
  );
}

const noSubscribe = () => () => {};

type ShareBarProps = { slug: string; title: string; url: string; initial: number };

export function ShareBar({ slug, title, url, initial }: ShareBarProps) {
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
    { label: "Telegram", icon: "bi-telegram", href: `https://t.me/share/url?url=${u}&text=${t}` },
    { label: "X", icon: "bi-twitter-x", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { label: "LinkedIn", icon: "bi-linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "Facebook", icon: "bi-facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];
  const button =
    "flex size-10 items-center justify-center rounded-full bg-white text-lg text-slate-600 shadow-sm transition hover:text-indigo-600 hover:shadow";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-slate-500">
        Share · {compact.format(shares)} {shares === 1 ? "share" : "shares"}
      </span>
      {targets.map((target) => (
        <a
          key={target.label}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={count}
          title={`Share on ${target.label}`}
          aria-label={`Share on ${target.label}`}
          className={button}
        >
          <i className={`bi ${target.icon}`} aria-hidden />
        </a>
      ))}
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
        title={copied ? "Copied!" : "Copy link"}
        aria-label="Copy link"
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
          title="More"
          aria-label="More sharing options"
          className={button}
        >
          <i className="bi bi-share" aria-hidden />
        </button>
      )}
    </div>
  );
}
