import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

/** sha256 of the client IP (salted with SESSION_SECRET), for rate limiting without storing IPs. */
export async function clientIpHash() {
  const h = await headers();
  // Netlify sets x-nf-client-connection-ip itself; the first x-forwarded-for entry can be spoofed.
  const ip =
    h.get("x-nf-client-connection-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  return createHash("sha256")
    .update(`${ip}:${process.env.SESSION_SECRET ?? ""}`)
    .digest("hex");
}
