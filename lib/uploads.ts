import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";

/**
 * Uploaded images live in Netlify Blobs and are served by app/uploads/[...key]/route.ts,
 * so the database stores a local path like /uploads/projects/<uuid>.webp that next/image
 * can optimize.
 *
 * Production writes to the "uploads" store. Deploy previews get a copy of the production
 * database, so they write to "uploads-preview", read from both, and never delete production
 * images. Outside Netlify (next dev / next start) files go to the gitignored .uploads folder.
 */

export const UPLOAD_PREFIX = "/uploads/";

export const IMAGE_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
} as const;

const CONTENT_TYPES = Object.fromEntries(Object.entries(IMAGE_TYPES).map(([type, ext]) => [ext, type]));

const KEY_PATTERN = /^(projects|blog)\/[0-9a-f-]{36}\.(png|jpg|webp|gif|avif)$/;

const PRODUCTION_STORE = "uploads";
const PREVIEW_STORE = "uploads-preview";
const LOCAL_DIR = path.join(process.cwd(), ".uploads");

type NetlifyGlobal = { context?: { deploy?: { context?: string } } | null };

function netlify() {
  return (globalThis as { Netlify?: NetlifyGlobal }).Netlify;
}

function writeStoreName() {
  return netlify()?.context?.deploy?.context === "production" ? PRODUCTION_STORE : PREVIEW_STORE;
}

function store(name: string) {
  return getStore({ name, consistency: "strong" });
}

export type UploadFolder = "projects" | "blog";

/** Saves an image and returns its public path. The caller validates type and size. */
export async function saveUpload(file: File, folder: UploadFolder) {
  const ext = IMAGE_TYPES[file.type as keyof typeof IMAGE_TYPES];
  const key = `${folder}/${randomUUID()}.${ext}`;
  const data = await file.arrayBuffer();

  if (netlify()) {
    await store(writeStoreName()).set(key, data);
  } else {
    const target = path.join(LOCAL_DIR, key);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, Buffer.from(data));
  }
  return `${UPLOAD_PREFIX}${key}`;
}

/** Returns the image bytes and content type, or null for unknown or malformed keys. */
export async function readUpload(key: string) {
  if (!KEY_PATTERN.test(key)) return null;
  const contentType = CONTENT_TYPES[key.slice(key.lastIndexOf(".") + 1)];

  if (netlify()) {
    const names = [...new Set([writeStoreName(), PRODUCTION_STORE])];
    for (const name of names) {
      const data: ArrayBuffer | null = await store(name).get(key, { type: "arrayBuffer" });
      if (data) return { data, contentType };
    }
    return null;
  }

  try {
    const data = await readFile(path.join(LOCAL_DIR, key));
    return { data: new Uint8Array(data), contentType };
  } catch {
    return null;
  }
}

/** True for a path returned by saveUpload, e.g. /uploads/projects/<uuid>.webp. */
export function isUploadPath(value: string) {
  return value.startsWith(UPLOAD_PREFIX) && KEY_PATTERN.test(value.slice(UPLOAD_PREFIX.length));
}

/** Deletes an image previously returned by saveUpload. Other URLs are left alone. */
export async function deleteUpload(url: string | null | undefined) {
  if (!url || !isUploadPath(url)) return;
  const key = url.slice(UPLOAD_PREFIX.length);

  try {
    if (netlify()) {
      await store(writeStoreName()).delete(key);
    } else {
      await rm(path.join(LOCAL_DIR, key), { force: true });
    }
  } catch (error) {
    console.error("[uploads] failed to delete", url, error);
  }
}
