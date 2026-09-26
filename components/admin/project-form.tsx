"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import type { Project } from "@/lib/generated/prisma/client";
import { CheckboxField, Field, FormError, SubmitButton, TextField } from "./fields";
import { LangTabs } from "./lang-tabs";
import { useFormRedirect } from "./use-form-redirect";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  project?: Project;
};

export function ProjectForm({ action, project }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  useFormRedirect(state);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm md:p-6">
      <FormError state={state} />

      <LangTabs state={state} fields={["title", "description", "note"]}>
        {(_, sfx) => (
          <>
            <TextField name={`title${sfx}`} label="Nomi" state={state} defaultValue={project?.[`title${sfx}`]} />
            <TextField
              name={`description${sfx}`}
              label="Tavsif"
              state={state}
              defaultValue={project?.[`description${sfx}`]}
              multiline
            />
            <TextField
              name={`note${sfx}`}
              label="Qo'shimcha izoh"
              state={state}
              defaultValue={project?.[`note${sfx}`]}
              hint="Masalan, demo uchun login/parol."
            />
          </>
        )}
      </LangTabs>

      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          name="backendStack"
          label="Backend texnologiyalari"
          state={state}
          defaultValue={project?.backendStack}
          placeholder="TypeScript, Node.js, Prisma, PostgreSQL"
        />
        <TextField
          name="frontendStack"
          label="Frontend texnologiyalari"
          state={state}
          defaultValue={project?.frontendStack}
          placeholder="SvelteKit, Tailwind"
        />
      </div>

      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="mb-3 text-sm font-semibold text-slate-500">Rasm</legend>
        <Field name="imageFile" label="Rasm yuklash" state={state} hint="PNG, JPG yoki WebP, 4 MB gacha.">
          <input
            id="imageFile"
            name="imageFile"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-medium"
          />
        </Field>
        <TextField
          name="imageUrl"
          label="...yoki rasm URL"
          state={state}
          defaultValue={project?.imageUrl}
          placeholder="https://..."
          hint="Fayl yuklansa, shu maydon avtomatik almashadi."
        />
      </fieldset>

      <fieldset className="grid gap-5 md:grid-cols-3">
        <legend className="mb-3 text-sm font-semibold text-slate-500">Havolalar</legend>
        <TextField
          name="repoUrl"
          label="GitHub (backend yoki asosiy)"
          type="url"
          state={state}
          defaultValue={project?.repoUrl}
          placeholder="https://github.com/..."
        />
        <TextField
          name="frontendRepoUrl"
          label="GitHub (frontend)"
          type="url"
          state={state}
          defaultValue={project?.frontendRepoUrl}
          placeholder="https://github.com/..."
        />
        <TextField
          name="demoUrl"
          label="Demo"
          type="url"
          state={state}
          defaultValue={project?.demoUrl}
          placeholder="https://..."
        />
      </fieldset>

      <div className="flex flex-wrap items-end gap-6">
        <div className="w-32">
          <TextField
            name="sortOrder"
            label="Tartib raqami"
            type="number"
            state={state}
            defaultValue={project?.sortOrder ?? 0}
          />
        </div>
        <CheckboxField
          name="published"
          label="Saytda ko'rsatish"
          state={state}
          defaultChecked={project?.published ?? true}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <SubmitButton pending={pending || !!state?.redirectTo}>{project ? "Saqlash" : "Qo'shish"}</SubmitButton>
        <Link href="/admin/projects" className="px-3 py-2 text-slate-600 hover:text-slate-900">
          Bekor qilish
        </Link>
      </div>
    </form>
  );
}
