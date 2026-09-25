"use server";

import { after } from "next/server";
import { z } from "zod";
import { clientIpHash } from "@/lib/client-ip";
import { db } from "@/lib/db";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, fill, hasLocale } from "@/lib/i18n";
import { notifyTelegram } from "@/lib/notify";
import { profile } from "@/lib/profile";

export type ContactState =
  | {
      ok?: boolean;
      error?: string;
      fieldErrors?: Partial<Record<"name" | "email" | "message", string[]>>;
      values?: { name: string; email: string; message: string };
    }
  | undefined;

const MAX_MESSAGES_PER_HOUR = 5;

const field = () => z.preprocess((v) => v ?? "", z.string().trim());

const contactSchema = (t: Dictionary["contact"]) =>
  z.object({
    name: field().pipe(z.string().min(1, t.nameRequired).max(80, t.nameTooLong)),
    email: field().pipe(z.email(t.emailInvalid).max(200, t.emailInvalid)),
    message: field().pipe(z.string().min(10, t.messageTooShort).max(3000, t.messageTooLong)),
  });

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // The form sends the page language so errors come back in it.
  const lang = String(formData.get("lang") ?? "");
  const t = getDictionary(hasLocale(lang) ? lang : DEFAULT_LOCALE).contact;

  // Honeypot: hidden from people, bots fill it in. Pretend it worked.
  if (String(formData.get("company") ?? "") !== "") return { ok: true };

  const parsed = contactSchema(t).safeParse(values);
  if (!parsed.success) {
    return {
      error: t.checkFields,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  try {
    const ipHash = await clientIpHash();
    const recent = await db.message.count({
      where: { ipHash, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
    });
    if (recent >= MAX_MESSAGES_PER_HOUR) {
      return { error: fill(t.tooMany, { email: profile.email }), values };
    }

    const { name, email, message } = parsed.data;
    await db.message.create({ data: { name, email, body: message, ipHash } });

    after(() =>
      notifyTelegram(`📩 New message on saad.uz\n\nFrom: ${name} <${email}>\n\n${message}`),
    );
  } catch (error) {
    console.error("[contact] sendMessage", error);
    return { error: fill(t.failed, { email: profile.email }), values };
  }

  return { ok: true };
}
