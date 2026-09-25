"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { FormState } from "@/app/admin/actions";
import type { SkillCategory } from "@/lib/generated/prisma/client";
import { CheckboxField, FormError, SubmitButton, TextField } from "./fields";
import { LangTabs } from "./lang-tabs";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  category?: SkillCategory;
};

export function SkillCategoryForm({ action, category }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [icon, setIcon] = useState(state?.values?.icon ?? category?.icon ?? "");
  const preview = icon.trim() ? `bi-${icon.trim().replace(/^bi-/, "")}` : "";

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm md:p-6">
      <FormError state={state} />

      <LangTabs state={state} fields={["title"]}>
        {(locale, sfx) => (
          <TextField
            name={`title${sfx}`}
            label="Nomi"
            state={state}
            defaultValue={category?.[`title${sfx}`]}
            placeholder={{ uz: "Ma'lumotlar bazalari", ru: "Базы данных", en: "Databases" }[locale]}
          />
        )}
      </LangTabs>

      <div className="flex items-end gap-3">
        <div className="flex-1" onChange={(event) => setIcon((event.target as HTMLInputElement).value)}>
          <TextField
            name="icon"
            label="Ikonka"
            state={state}
            defaultValue={category?.icon}
            placeholder="database"
            required
            hint="icons.getbootstrap.com dagi nom, masalan: database, cloud, cpu."
          />
        </div>
        {/* mb-6 lines the preview up with the input above its hint line. */}
        <span
          className="mb-6 flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-600"
          title="Ko'rinishi"
        >
          {preview && <i className={`bi ${preview}`} aria-hidden />}
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div className="w-32">
          <TextField
            name="sortOrder"
            label="Tartib raqami"
            type="number"
            state={state}
            defaultValue={category?.sortOrder ?? 0}
          />
        </div>
        <CheckboxField
          name="published"
          label="Saytda ko'rsatish"
          state={state}
          defaultChecked={category?.published ?? true}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <SubmitButton pending={pending}>{category ? "Saqlash" : "Qo'shish"}</SubmitButton>
        <Link href="/admin/skills" className="px-3 py-2 text-slate-600 hover:text-slate-900">
          Bekor qilish
        </Link>
      </div>
    </form>
  );
}
