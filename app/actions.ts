"use server";

import { after } from "next/server";
import { z } from "zod";
import { clientIpHash } from "@/lib/client-ip";
import { db } from "@/lib/db";
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

const contactSchema = z.object({
  name: field().pipe(z.string().min(1, "Please enter your name.").max(80, "Name is too long.")),
  email: field().pipe(z.email("Please enter a valid email address.").max(200)),
  message: field().pipe(
    z.string().min(10, "Message should be at least 10 characters.").max(3000, "Message is too long (3000 max)."),
  ),
});

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: hidden from people, bots fill it in. Pretend it worked.
  if (String(formData.get("company") ?? "") !== "") return { ok: true };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: "Please check the highlighted fields.",
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
      return { error: `Too many messages. Please try again later or email ${profile.email}.`, values };
    }

    const { name, email, message } = parsed.data;
    await db.message.create({ data: { name, email, body: message, ipHash } });

    after(() =>
      notifyTelegram(`📩 New message on saad.uz\n\nFrom: ${name} <${email}>\n\n${message}`),
    );
  } catch (error) {
    console.error("[contact] sendMessage", error);
    return { error: `Something went wrong. Please email me directly at ${profile.email}.`, values };
  }

  return { ok: true };
}
