"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { FormError } from "./fields";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormError state={state} />
      <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Parol
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Tekshirilmoqda..." : "Kirish"}
      </button>
    </form>
  );
}
