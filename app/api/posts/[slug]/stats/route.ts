import { after, type NextRequest } from "next/server";
import { clientIpHash } from "@/lib/client-ip";
import { db } from "@/lib/db";

const KINDS = ["view", "share"] as const;
type Kind = (typeof KINDS)[number];

const BOT = /bot|crawl|spider|slurp|preview|headless|facebookexternalhit|lighthouse/i;
const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Counts a view or a share of a published post and returns the current totals.
 * Each visitor (IP) counts once per post, kind and day, so reloads do not inflate the numbers.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/posts/[slug]/stats">) {
  // Only the site itself posts here; a browser always sends Origin on cross-site POSTs.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return Response.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE });
  }

  const body: unknown = await request.json().catch(() => null);
  const kind = (body as { kind?: unknown } | null)?.kind;
  if (!KINDS.includes(kind as Kind)) {
    return Response.json({ error: "kind must be view or share" }, { status: 400, headers: NO_STORE });
  }

  const { slug } = await ctx.params;
  const post = await db.post.findFirst({
    where: { slug, published: true },
    select: { id: true, views: true, shares: true },
  });
  if (!post) return Response.json({ error: "Not found" }, { status: 404, headers: NO_STORE });

  let counts = { views: post.views, shares: post.shares };
  if (!BOT.test(request.headers.get("user-agent") ?? "")) {
    const { count } = await db.postEvent.createMany({
      data: { postId: post.id, kind: kind as Kind, ipHash: await clientIpHash(), day: new Date().toISOString().slice(0, 10) },
      skipDuplicates: true,
    });
    if (count > 0) {
      counts = await db.post.update({
        where: { id: post.id },
        data: kind === "view" ? { views: { increment: 1 } } : { shares: { increment: 1 } },
        select: { views: true, shares: true },
      });
      // Events only exist to deduplicate within a day.
      after(() => db.postEvent.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 2 * 86_400_000) } } }));
    }
  }

  return Response.json(counts, { headers: NO_STORE });
}
