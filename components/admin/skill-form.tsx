"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import type { Skill, SkillCategory } from "@/lib/generated/prisma/client";
import { CheckboxField, FormError, SelectField, SubmitButton, TextField } from "./fields";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  skill?: Skill;
  categories: Pick<SkillCategory, "id" | "title">[];
  /** Preselected category for a new skill (from ?category=). */
  categoryId?: string;
};

export function SkillForm({ action, skill, categories, categoryId }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const categoryOptions = categories.map((category) => ({ value: category.id, label: category.title }));

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm md:p-6">
      <FormError state={state} />

      <div className="grid gap-5 md:grid-cols-2">
        <TextField name="name" label="Nomi" state={state} defaultValue={skill?.name} placeholder="Docker" required />
        <SelectField
          name="categoryId"
          label="Bo'lim"
          state={state}
          defaultValue={skill?.categoryId ?? categoryId ?? categories[0]?.id}
          options={categoryOptions}
        />
      </div>

      <TextField
        name="icon"
        label="Ikonka"
        state={state}
        defaultValue={skill?.icon}
        placeholder="docker"
        required
        hint="devicon.dev dagi nom (masalan, docker, redis, go) yoki rasmning to'liq https:// manzili."
      />

      <div className="flex flex-wrap items-end gap-6">
        <div className="w-32">
          <TextField
            name="sortOrder"
            label="Tartib raqami"
            type="number"
            state={state}
            defaultValue={skill?.sortOrder ?? 0}
          />
        </div>
        <CheckboxField
          name="published"
          label="Saytda ko'rsatish"
          state={state}
          defaultChecked={skill?.published ?? true}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <SubmitButton pending={pending}>{skill ? "Saqlash" : "Qo'shish"}</SubmitButton>
        <Link href="/admin/skills" className="px-3 py-2 text-slate-600 hover:text-slate-900">
          Bekor qilish
        </Link>
      </div>
    </form>
  );
}
