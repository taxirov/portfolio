"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import type { SocialLink } from "@/lib/generated/prisma/client";
import { PLATFORMS, PLATFORM_KEYS } from "@/lib/platforms";
import { CheckboxField, FormError, SelectField, SubmitButton, TextField } from "./fields";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  social?: SocialLink;
};

const platformOptions = PLATFORM_KEYS.map((key) => ({ value: key, label: PLATFORMS[key].label }));

export function SocialForm({ action, social }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm md:p-6">
      <FormError state={state} />

      <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          name="platform"
          label="Platforma"
          state={state}
          defaultValue={social?.platform ?? "telegram"}
          options={platformOptions}
        />
        <TextField
          name="label"
          label="Nomi (ixtiyoriy)"
          state={state}
          defaultValue={social?.label}
          hint="Bo'sh qolsa, platforma nomi ishlatiladi."
        />
      </div>

      <TextField
        name="url"
        label="Manzil"
        state={state}
        defaultValue={social?.url}
        placeholder="https://t.me/username"
        required
      />

      <div className="flex flex-wrap items-end gap-6">
        <div className="w-32">
          <TextField
            name="sortOrder"
            label="Tartib raqami"
            type="number"
            state={state}
            defaultValue={social?.sortOrder ?? 0}
          />
        </div>
        <CheckboxField
          name="showInHero"
          label="Bosh ekranda ham ko'rsatish"
          state={state}
          defaultChecked={social?.showInHero ?? false}
        />
        <CheckboxField
          name="published"
          label="Saytda ko'rsatish"
          state={state}
          defaultChecked={social?.published ?? true}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <SubmitButton pending={pending}>{social ? "Saqlash" : "Qo'shish"}</SubmitButton>
        <Link href="/admin/socials" className="px-3 py-2 text-slate-600 hover:text-slate-900">
          Bekor qilish
        </Link>
      </div>
    </form>
  );
}
