"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { PLATFORM_KEYS } from "@/lib/platforms";
import { createSession, deleteSession, requireAdmin } from "@/lib/session";
import { isSafeUrl } from "@/lib/url";

export type FormState =
  | {
      error?: string;
      fieldErrors?: Partial<Record<string, string[]>>;
      /** Echoed back so the form keeps what was typed after a failed submit. */
      values?: Record<string, string>;
    }
  | undefined;

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

// ---------------------------------------------------------------- auth

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { error: "Serverda ADMIN_PASSWORD sozlanmagan." };

  const password = String(formData.get("password") ?? "");
  const hash = (value: string) => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(hash(password), hash(expected))) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "Parol noto'g'ri." };
  }

  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- helpers

// A field missing from the submitted form counts as empty.
const str = () => z.preprocess((v) => v ?? "", z.string().trim());
const text = (max: number, required?: string) =>
  str().pipe(
    z
      .string()
      .min(required ? 1 : 0, required)
      .max(max, `Ko'pi bilan ${max} ta belgi.`),
  );
const optionalText = (max: number) => text(max).transform((v) => v || null);
const optionalUrl = str()
  .refine((v) => v === "" || isSafeUrl(v), "http:// yoki https:// bilan boshlanuvchi to'liq manzil kiriting.")
  .transform((v) => v || null);
const sortOrder = z.preprocess(
  (v) => (v === undefined || v === "" ? 0 : v),
  z.coerce.number("Son kiriting.").int("Butun son kiriting.").min(-9999).max(9999),
);

function formValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [key, value] of formData) {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  }
  return values;
}

function invalid(error: z.ZodError, values: Record<string, string>): FormState {
  return { error: "Maydonlarni tekshiring.", fieldErrors: z.flattenError(error).fieldErrors, values };
}

function isBlobUrl(url: string | null | undefined): url is string {
  return !!url && url.includes(".public.blob.vercel-storage.com/");
}

async function deleteBlob(url: string | null | undefined) {
  if (!isBlobUrl(url) || !process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(url);
  } catch (error) {
    console.error("[admin] failed to delete blob", url, error);
  }
}

function refreshPublicSite() {
  revalidatePath("/");
}

// ---------------------------------------------------------------- projects

const projectSchema = z.object({
  title: text(120, "Nomini kiriting."),
  description: text(2000, "Tavsif kiriting."),
  backendStack: optionalText(200),
  frontendStack: optionalText(200),
  note: optionalText(300),
  imageUrl: optionalUrl,
  repoUrl: optionalUrl,
  frontendRepoUrl: optionalUrl,
  demoUrl: optionalUrl,
  sortOrder,
  published: z.boolean(),
});

export async function saveProject(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);

  const parsed = projectSchema.safeParse({ ...values, published: formData.get("published") === "on" });
  if (!parsed.success) return invalid(parsed.error, values);
  const data = parsed.data;

  const existing = id ? await db.project.findUnique({ where: { id } }) : null;
  if (id && !existing) return { error: "Loyiha topilmadi (o'chirilgan bo'lishi mumkin).", values };

  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return { fieldErrors: { imageFile: ["Faqat rasm fayl yuklang."] }, values };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { fieldErrors: { imageFile: ["Rasm 4 MB dan kichik bo'lsin."] }, values };
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        fieldErrors: { imageFile: ["Rasm yuklash uchun BLOB_READ_WRITE_TOKEN kerak. Hozircha rasm URL'ini kiriting."] },
        values,
      };
    }
    const blob = await put(`projects/${file.name}`, file, { access: "public", addRandomSuffix: true });
    data.imageUrl = blob.url;
  }

  try {
    if (existing) {
      await db.project.update({ where: { id: existing.id }, data });
      if (existing.imageUrl !== data.imageUrl) await deleteBlob(existing.imageUrl);
    } else {
      await db.project.create({ data });
    }
  } catch (error) {
    console.error("[admin] saveProject", error);
    return { error: "Saqlashda xatolik yuz berdi. Keyinroq qayta urinib ko'ring.", values };
  }

  refreshPublicSite();
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const project = await db.project.findUnique({ where: { id } });
  if (project) {
    await db.project.delete({ where: { id } });
    await deleteBlob(project.imageUrl);
  }
  refreshPublicSite();
  revalidatePath("/admin/projects");
}

export async function toggleProject(id: string, published: boolean) {
  await requireAdmin();
  await db.project.update({ where: { id }, data: { published } });
  refreshPublicSite();
  revalidatePath("/admin/projects");
}

// ---------------------------------------------------------------- social links

const socialSchema = z
  .object({
    platform: z.enum(PLATFORM_KEYS, "Platformani tanlang."),
    url: text(500, "Manzilni kiriting."),
    label: optionalText(60),
    showInHero: z.boolean(),
    sortOrder,
    published: z.boolean(),
  })
  .superRefine((value, ctx) => {
    const protocols = value.platform === "email" ? ["mailto:"] : ["http:", "https:"];
    if (!isSafeUrl(value.url, protocols)) {
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message:
          value.platform === "email"
            ? "Email uchun mailto:nom@example.com ko'rinishida kiriting."
            : "https:// bilan boshlanuvchi to'liq manzil kiriting.",
      });
    }
  });

export async function saveSocial(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);

  let url = values.url?.trim() ?? "";
  // Let "name@example.com" work for the email platform.
  if (values.platform === "email" && url && !url.startsWith("mailto:")) url = `mailto:${url}`;

  const parsed = socialSchema.safeParse({
    ...values,
    url,
    showInHero: formData.get("showInHero") === "on",
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return invalid(parsed.error, values);

  try {
    if (id) {
      await db.socialLink.update({ where: { id }, data: parsed.data });
    } else {
      await db.socialLink.create({ data: parsed.data });
    }
  } catch (error) {
    console.error("[admin] saveSocial", error);
    return { error: "Saqlashda xatolik yuz berdi. Keyinroq qayta urinib ko'ring.", values };
  }

  refreshPublicSite();
  redirect("/admin/socials");
}

export async function deleteSocial(id: string) {
  await requireAdmin();
  await db.socialLink.deleteMany({ where: { id } });
  refreshPublicSite();
  revalidatePath("/admin/socials");
}

export async function toggleSocial(id: string, published: boolean) {
  await requireAdmin();
  await db.socialLink.update({ where: { id }, data: { published } });
  refreshPublicSite();
  revalidatePath("/admin/socials");
}
