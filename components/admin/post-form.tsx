"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { FormState } from "@/app/admin/actions";
import { Markdown } from "@/components/markdown";
import type { Post } from "@/lib/generated/prisma/client";
import { slugify } from "@/lib/slug";
import { CheckboxField, Field, FormError, SubmitButton, TextField } from "./fields";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  post?: Post;
};

const textareaClass =
  "min-h-96 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

export function PostForm({ action, post }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [content, setContent] = useState(post?.content ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm md:p-6">
      <FormError state={state} />

      <Field name="title" label="Sarlavha" state={state}>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!state?.fieldErrors?.title}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-lg font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </Field>

      <TextField
        name="slug"
        label="Slug (manzil)"
        state={state}
        defaultValue={post?.slug}
        placeholder={slugify(title) || "post-manzili"}
        hint={`saad.uz/blogs/${slugify(title) || "..."}. Bo'sh qolsa, sarlavhadan yasaladi.`}
      />

      <TextField
        name="excerpt"
        label="Qisqa tavsif"
        state={state}
        defaultValue={post?.excerpt}
        hint="Ro'yxatda va Google/Telegram preview'da ko'rinadi."
      />

      <Field name="content" label="Matn (Markdown)" state={state}>
        <div className="flex gap-1 text-sm">
          {(["write", "preview"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-md px-3 py-1.5 font-medium ${
                tab === key ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {key === "write" ? "Yozish" : "Ko'rish"}
            </button>
          ))}
        </div>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-invalid={!!state?.fieldErrors?.content}
          className={`${textareaClass} ${tab === "write" ? "" : "hidden"}`}
          placeholder={"## Sarlavha\n\nMatn, **qalin**, `kod`, [havola](https://...)\n\n```ts\nconsole.log('salom')\n```"}
        />
        {tab === "preview" && (
          <div className="min-h-96 rounded-lg border border-slate-200 p-4">
            {content.trim() ? <Markdown>{content}</Markdown> : <p className="text-slate-400">Hali matn yo&apos;q.</p>}
          </div>
        )}
      </Field>

      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="mb-3 text-sm font-semibold text-slate-500">Muqova rasmi (ixtiyoriy)</legend>
        <Field name="coverFile" label="Rasm yuklash" state={state} hint="PNG, JPG yoki WebP, 4 MB gacha.">
          <input
            id="coverFile"
            name="coverFile"
            type="file"
            accept="image/*"
            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-medium"
          />
        </Field>
        <TextField
          name="coverUrl"
          label="...yoki rasm URL"
          type="url"
          state={state}
          defaultValue={post?.coverUrl}
          placeholder="https://..."
        />
      </fieldset>

      <CheckboxField name="published" label="E'lon qilish (saytda ko'rinadi)" state={state} defaultChecked={post?.published ?? false} />

      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <SubmitButton pending={pending}>{post ? "Saqlash" : "Yaratish"}</SubmitButton>
        <Link href="/admin/posts" className="px-3 py-2 text-slate-600 hover:text-slate-900">
          Bekor qilish
        </Link>
        {post?.published && (
          <a
            href={`/blogs/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm text-indigo-600 hover:underline"
          >
            Saytda ko&apos;rish <i className="bi bi-box-arrow-up-right" aria-hidden />
          </a>
        )}
      </div>
    </form>
  );
}
