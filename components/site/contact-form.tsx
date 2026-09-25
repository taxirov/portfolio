"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/actions";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 aria-[invalid=true]:border-red-400";

function Errors({ state, name }: { state: ContactState; name: "name" | "email" | "message" }) {
  return state?.fieldErrors?.[name]?.map((error) => (
    <p key={error} id={`${name}-error`} className="text-sm text-red-600">
      {error}
    </p>
  ));
}

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary["contact"] }) {
  const [state, formAction, pending] = useActionState(sendMessage, undefined);

  if (state?.ok) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-sm">
        <i className="bi bi-check-circle-fill text-4xl text-emerald-500" aria-hidden />
        <p className="text-xl font-semibold">{dict.thanks}</p>
        <p className="text-slate-500">{dict.reply}</p>
      </div>
    );
  }

  const invalid = (name: "name" | "email" | "message") => !!state?.fieldErrors?.[name];

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm md:p-6" noValidate>
      <input type="hidden" name="lang" value={locale} />
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          {dict.name}
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={80}
            defaultValue={state?.values?.name}
            aria-invalid={invalid("name")}
            aria-describedby="name-error"
            className={inputClass}
          />
          <Errors state={state} name="name" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          {dict.email}
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            defaultValue={state?.values?.email}
            aria-invalid={invalid("email")}
            aria-describedby="email-error"
            className={inputClass}
          />
          <Errors state={state} name="email" />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        {dict.message}
        <textarea
          name="message"
          rows={5}
          required
          maxLength={3000}
          defaultValue={state?.values?.message}
          aria-invalid={invalid("message")}
          aria-describedby="message-error"
          className={inputClass}
        />
        <Errors state={state} name="message" />
      </label>
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
      >
        <i className="bi bi-send" aria-hidden /> {pending ? dict.sending : dict.send}
      </button>
    </form>
  );
}
