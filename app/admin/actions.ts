"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { clientIpHash } from "@/lib/client-ip";
import { db } from "@/lib/db";
import { CURRENCIES, DOMAIN_PATTERN, normalizeDomain } from "@/lib/domains";
import { notifyTelegram } from "@/lib/notify";
import { PLATFORM_KEYS } from "@/lib/platforms";
import { createSession, deleteSession, requireAdmin } from "@/lib/session";
import { resolveCategoryIcon, resolveSkillIcon } from "@/lib/skills";
import { SLUG_PATTERN, slugify } from "@/lib/slug";
import { deleteUpload, IMAGE_TYPES, saveUpload, type UploadFolder } from "@/lib/uploads";
import { isLocalPath, isSafeUrl } from "@/lib/url";

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

// The password is short, so failed logins are capped per IP and in total.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_IP = 5;
const MAX_FAILS_TOTAL = 20;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { error: "Serverda ADMIN_PASSWORD sozlanmagan." };

  const ipHash = await clientIpHash();
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);
  const [ipFails, totalFails] = await Promise.all([
    db.loginAttempt.count({ where: { ipHash, createdAt: { gt: since } } }),
    db.loginAttempt.count({ where: { createdAt: { gt: since } } }),
  ]);
  if (ipFails >= MAX_FAILS_PER_IP || totalFails >= MAX_FAILS_TOTAL) {
    return { error: "Urinishlar juda ko'p. 15 daqiqadan keyin qayta urinib ko'ring." };
  }

  const password = String(formData.get("password") ?? "");
  const hash = (value: string) => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(hash(password), hash(expected))) {
    await db.loginAttempt.create({ data: { ipHash } });
    if (totalFails + 1 === MAX_FAILS_TOTAL) {
      after(() => notifyTelegram("⚠️ app.saad.uz: too many failed admin logins, login is paused for 15 minutes."));
    }
    after(() => db.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 86_400_000) } } }));
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
// Image fields also accept a path on this site, e.g. /images/cafe.webp or an uploaded /uploads/... file.
const optionalImageUrl = str()
  .refine(
    (v) => v === "" || isLocalPath(v) || isSafeUrl(v),
    "https:// bilan boshlanuvchi manzil yoki /images/... kabi sayt ichidagi yo'l kiriting.",
  )
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

/** Saves an optional image form field and returns its /uploads/... path. */
async function uploadImage(
  file: FormDataEntryValue | null,
  folder: UploadFolder,
): Promise<{ url?: string; error?: string }> {
  if (!(file instanceof File) || file.size === 0) return {};
  if (!(file.type in IMAGE_TYPES)) return { error: "Faqat PNG, JPG, WebP, GIF yoki AVIF rasm yuklang." };
  if (file.size > MAX_IMAGE_BYTES) return { error: "Rasm 4 MB dan kichik bo'lsin." };
  try {
    return { url: await saveUpload(file, folder) };
  } catch (error) {
    console.error("[admin] uploadImage", error);
    return { error: "Rasmni yuklab bo'lmadi. Keyinroq qayta urinib ko'ring." };
  }
}

/** Every public page in every language, plus the sitemap. */
function refreshPublicSite() {
  revalidatePath("/[lang]", "layout");
  revalidatePath("/sitemap.xml");
}

// ---------------------------------------------------------------- translations

const LANG_SUFFIXES = ["Uz", "Ru", "En"] as const;
type Translated<F extends string> = `${F}${(typeof LANG_SUFFIXES)[number]}`;

/** titleUz / titleRu / titleEn form fields for one translated column. */
function translated<F extends string>(field: F, max: number) {
  return Object.fromEntries(LANG_SUFFIXES.map((suffix) => [`${field}${suffix}`, optionalText(max)])) as Record<
    Translated<F>,
    ReturnType<typeof optionalText>
  >;
}

/** A required translated field needs at least one language; the error shows on every language tab. */
function requireOneLanguage(value: Record<string, unknown>, ctx: z.RefinementCtx, field: string, message: string) {
  if (LANG_SUFFIXES.some((suffix) => value[`${field}${suffix}`])) return;
  for (const suffix of LANG_SUFFIXES) ctx.addIssue({ code: "custom", path: [`${field}${suffix}`], message });
}

// ---------------------------------------------------------------- projects

const projectSchema = z
  .object({
    ...translated("title", 120),
    ...translated("description", 2000),
    ...translated("note", 300),
    backendStack: optionalText(200),
    frontendStack: optionalText(200),
    imageUrl: optionalImageUrl,
    repoUrl: optionalUrl,
    frontendRepoUrl: optionalUrl,
    demoUrl: optionalUrl,
    sortOrder,
    published: z.boolean(),
  })
  .superRefine((value, ctx) => {
    requireOneLanguage(value, ctx, "title", "Kamida bitta tilda nom kiriting.");
    requireOneLanguage(value, ctx, "description", "Kamida bitta tilda tavsif kiriting.");
  });

export async function saveProject(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);

  const parsed = projectSchema.safeParse({ ...values, published: formData.get("published") === "on" });
  if (!parsed.success) return invalid(parsed.error, values);
  const data = parsed.data;

  const existing = id ? await db.project.findUnique({ where: { id } }) : null;
  if (id && !existing) return { error: "Loyiha topilmadi (o'chirilgan bo'lishi mumkin).", values };

  const upload = await uploadImage(formData.get("imageFile"), "projects");
  if (upload.error) return { fieldErrors: { imageFile: [upload.error] }, values };
  if (upload.url) data.imageUrl = upload.url;

  try {
    if (existing) {
      await db.project.update({ where: { id: existing.id }, data });
      if (existing.imageUrl !== data.imageUrl) await deleteUpload(existing.imageUrl);
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
    await deleteUpload(project.imageUrl);
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

// ---------------------------------------------------------------- skills

const skillSchema = z.object({
  name: text(60, "Nomini kiriting."),
  categoryId: text(40, "Bo'limni tanlang."),
  icon: text(500, "Ikonka kiriting.").transform((value, ctx) => {
    const url = resolveSkillIcon(value);
    if (!url) {
      ctx.addIssue({ code: "custom", message: "Devicon nomi (masalan, docker) yoki https:// manzil kiriting." });
      return z.NEVER;
    }
    return url;
  }),
  sortOrder,
  published: z.boolean(),
});

export async function saveSkill(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);

  const parsed = skillSchema.safeParse({ ...values, published: formData.get("published") === "on" });
  if (!parsed.success) return invalid(parsed.error, values);

  const category = await db.skillCategory.findUnique({ where: { id: parsed.data.categoryId }, select: { id: true } });
  if (!category) return { fieldErrors: { categoryId: ["Bo'lim topilmadi (o'chirilgan bo'lishi mumkin)."] }, values };

  try {
    if (id) {
      await db.skill.update({ where: { id }, data: parsed.data });
    } else {
      await db.skill.create({ data: parsed.data });
    }
  } catch (error) {
    console.error("[admin] saveSkill", error);
    return { error: "Saqlashda xatolik yuz berdi. Keyinroq qayta urinib ko'ring.", values };
  }

  refreshPublicSite();
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await db.skill.deleteMany({ where: { id } });
  refreshPublicSite();
  revalidatePath("/admin/skills");
}

export async function toggleSkill(id: string, published: boolean) {
  await requireAdmin();
  await db.skill.update({ where: { id }, data: { published } });
  refreshPublicSite();
  revalidatePath("/admin/skills");
}

const skillCategorySchema = z
  .object({
    ...translated("title", 60),
    icon: text(60, "Ikonka kiriting.").transform((value, ctx) => {
      const icon = resolveCategoryIcon(value);
      if (!icon) {
        ctx.addIssue({ code: "custom", message: "Bootstrap Icons nomini kiriting, masalan: cloud yoki bi-cloud." });
        return z.NEVER;
      }
      return icon;
    }),
    sortOrder,
    published: z.boolean(),
  })
  .superRefine((value, ctx) => requireOneLanguage(value, ctx, "title", "Kamida bitta tilda nom kiriting."));

export async function saveSkillCategory(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);

  const parsed = skillCategorySchema.safeParse({ ...values, published: formData.get("published") === "on" });
  if (!parsed.success) return invalid(parsed.error, values);

  try {
    if (id) {
      await db.skillCategory.update({ where: { id }, data: parsed.data });
    } else {
      await db.skillCategory.create({ data: parsed.data });
    }
  } catch (error) {
    console.error("[admin] saveSkillCategory", error);
    return { error: "Saqlashda xatolik yuz berdi. Keyinroq qayta urinib ko'ring.", values };
  }

  refreshPublicSite();
  redirect("/admin/skills");
}

/** Only empty categories can be deleted, so a click never takes skills with it. */
export async function deleteSkillCategory(id: string): Promise<{ error?: string } | void> {
  await requireAdmin();
  const skills = await db.skill.count({ where: { categoryId: id } });
  if (skills > 0) {
    return { error: `Bu bo'limda ${skills} ta ko'nikma bor. Avval ularni boshqa bo'limga o'tkazing yoki o'chiring.` };
  }
  await db.skillCategory.deleteMany({ where: { id } });
  refreshPublicSite();
  revalidatePath("/admin/skills");
}

export async function toggleSkillCategory(id: string, published: boolean) {
  await requireAdmin();
  await db.skillCategory.update({ where: { id }, data: { published } });
  refreshPublicSite();
  revalidatePath("/admin/skills");
}

// ---------------------------------------------------------------- domains for sale

const domainSchema = z.object({
  name: str()
    .transform(normalizeDomain)
    .pipe(z.string().min(1, "Domen nomini kiriting.").regex(DOMAIN_PATTERN, "Masalan: example.uz yoki my-shop.com")),
  price: z.preprocess(
    (v) => (typeof v === "string" ? v.replace(/[\s,.]/g, "") : v) || undefined,
    z.coerce.number("Son kiriting.").int("Butun son kiriting.").positive("Noldan katta son kiriting.").max(1e12).optional(),
  ),
  currency: z.enum(CURRENCIES, "Valyutani tanlang."),
  ...translated("description", 500),
  sortOrder,
  sold: z.boolean(),
  published: z.boolean(),
});

export async function saveDomain(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);

  const parsed = domainSchema.safeParse({
    ...values,
    sold: formData.get("sold") === "on",
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return invalid(parsed.error, values);
  const data = { ...parsed.data, price: parsed.data.price ?? null };

  const taken = await db.domain.findUnique({ where: { name: data.name }, select: { id: true } });
  if (taken && taken.id !== id) return { fieldErrors: { name: ["Bu domen ro'yxatda bor."] }, values };

  try {
    if (id) {
      await db.domain.update({ where: { id }, data });
    } else {
      await db.domain.create({ data });
    }
  } catch (error) {
    console.error("[admin] saveDomain", error);
    return { error: "Saqlashda xatolik yuz berdi. Keyinroq qayta urinib ko'ring.", values };
  }

  refreshPublicSite();
  redirect("/admin/domains");
}

export async function deleteDomain(id: string) {
  await requireAdmin();
  await db.domain.deleteMany({ where: { id } });
  refreshPublicSite();
  revalidatePath("/admin/domains");
}

export async function toggleDomain(id: string, published: boolean) {
  await requireAdmin();
  await db.domain.update({ where: { id }, data: { published } });
  refreshPublicSite();
  revalidatePath("/admin/domains");
}

// ---------------------------------------------------------------- blog posts

const postSchema = z
  .object({
    ...translated("title", 160),
    ...translated("excerpt", 300),
    ...translated("content", 100_000),
    slug: text(80).refine((v) => v === "" || SLUG_PATTERN.test(v), "Faqat kichik lotin harflari, raqamlar va '-'."),
    coverUrl: optionalImageUrl,
    published: z.boolean(),
  })
  .superRefine((value, ctx) => {
    requireOneLanguage(value, ctx, "title", "Kamida bitta tilda sarlavha kiriting.");
    requireOneLanguage(value, ctx, "content", "Kamida bitta tilda matn kiriting.");
  });

export async function savePost(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);

  const parsed = postSchema.safeParse({ ...values, published: formData.get("published") === "on" });
  if (!parsed.success) return invalid(parsed.error, values);
  const { slug: rawSlug, ...fields } = parsed.data;

  // Slugs are Latin, so they come from the English or Uzbek title when one is given.
  const slug = rawSlug || slugify(fields.titleEn ?? fields.titleUz ?? fields.titleRu ?? "");
  if (!slug) return { fieldErrors: { slug: ["Slug'ni qo'lda kiriting."] }, values };

  const existing = id ? await db.post.findUnique({ where: { id } }) : null;
  if (id && !existing) return { error: "Post topilmadi (o'chirilgan bo'lishi mumkin).", values };

  const taken = await db.post.findUnique({ where: { slug }, select: { id: true } });
  if (taken && taken.id !== id) return { fieldErrors: { slug: ["Bu slug band. Boshqasini kiriting."] }, values };

  const upload = await uploadImage(formData.get("coverFile"), "blog");
  if (upload.error) return { fieldErrors: { coverFile: [upload.error] }, values };
  if (upload.url) fields.coverUrl = upload.url;

  // The first time a post goes live it gets its publication date; later edits keep it.
  const publishedAt = fields.published ? (existing?.publishedAt ?? new Date()) : (existing?.publishedAt ?? null);
  const data = { ...fields, slug, publishedAt };

  try {
    if (existing) {
      await db.post.update({ where: { id: existing.id }, data });
      if (existing.coverUrl !== data.coverUrl) await deleteUpload(existing.coverUrl);
    } else {
      await db.post.create({ data });
    }
  } catch (error) {
    console.error("[admin] savePost", error);
    return { error: "Saqlashda xatolik yuz berdi. Keyinroq qayta urinib ko'ring.", values };
  }

  refreshPublicSite();
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireAdmin();
  const post = await db.post.findUnique({ where: { id } });
  if (post) {
    await db.post.delete({ where: { id } });
    await deleteUpload(post.coverUrl);
    refreshPublicSite();
  }
  revalidatePath("/admin/posts");
}

export async function togglePost(id: string, published: boolean) {
  await requireAdmin();
  const post = await db.post.findUnique({ where: { id } });
  if (!post) return;
  await db.post.update({
    where: { id },
    data: { published, publishedAt: published ? (post.publishedAt ?? new Date()) : post.publishedAt },
  });
  refreshPublicSite();
  revalidatePath("/admin/posts");
}

// ---------------------------------------------------------------- contact messages

export async function setMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await db.message.updateMany({ where: { id }, data: { read } });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await db.message.deleteMany({ where: { id } });
  revalidatePath("/admin", "layout");
}
