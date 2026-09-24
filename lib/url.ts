/** Only let http(s)/mailto/tel URLs reach an href or src, never javascript: and friends. */
export function isSafeUrl(value: string, protocols = ["http:", "https:"]) {
  try {
    return protocols.includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

/** A path on this site like /images/a.webp; rejects protocol-relative //host and backslash tricks. */
export function isLocalPath(value: string) {
  return /^\/(?![/\\])[^\s\\]*$/.test(value);
}

/** next/image only optimizes local paths, which include uploads served from /uploads/... */
export function isOptimizableImage(src: string) {
  return isLocalPath(src);
}
