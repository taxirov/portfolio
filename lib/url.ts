/** Only let http(s)/mailto/tel URLs reach an href or src, never javascript: and friends. */
export function isSafeUrl(value: string, protocols = ["http:", "https:"]) {
  try {
    return protocols.includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

/** next/image can only optimize local files and hosts listed in next.config.ts. */
export function isOptimizableImage(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}
