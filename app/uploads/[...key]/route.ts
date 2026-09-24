import type { NextRequest } from "next/server";
import { readUpload } from "@/lib/uploads";

// Keys contain a random UUID and are never overwritten, so responses can be cached forever.
export async function GET(_req: NextRequest, ctx: RouteContext<"/uploads/[...key]">) {
  const { key } = await ctx.params;
  const upload = await readUpload(key.join("/"));
  if (!upload) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  return new Response(upload.data, {
    headers: {
      "Content-Type": upload.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
