"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import { CURRENCIES } from "@/lib/domains";
import type { Domain } from "@/lib/generated/prisma/client";
import { CheckboxField, FormError, SelectField, SubmitButton, TextField } from "./fields";
import { LangTabs } from "./lang-tabs";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  domain?: Domain;
};

const currencyOptions = CURRENCIES.map((currency) => ({
  value: currency,
  label: currency === "USD" ? "USD ($)" : "UZS (so'm)",
}));

export function DomainForm({ action, domain }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm md:p-6">
      <FormError state={state} />

      <TextField
        name="name"
        label="Domen"
        state={state}
        defaultValue={domain?.name}
        placeholder="example.uz"
        required
        hint="https:// va www. bo'lsa, o'zi olib tashlanadi."
      />

      <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
        <TextField
          name="price"
          label="Narxi (ixtiyoriy)"
          state={state}
          defaultValue={domain?.price}
          placeholder="500"
          hint={`Bo'sh qolsa, saytda "Narxni taklif qiling" deb chiqadi.`}
        />
        <SelectField
          name="currency"
          label="Valyuta"
          state={state}
          defaultValue={domain?.currency ?? "USD"}
          options={currencyOptions}
        />
      </div>

      <LangTabs state={state} fields={["description"]}>
        {(_, sfx) => (
          <TextField
            name={`description${sfx}`}
            label="Qisqa tavsif (ixtiyoriy)"
            state={state}
            defaultValue={domain?.[`description${sfx}`]}
            multiline
            hint="Masalan: qisqa va esda qoladigan, onlayn do'kon uchun mos."
          />
        )}
      </LangTabs>

      <div className="flex flex-wrap items-end gap-6">
        <div className="w-32">
          <TextField
            name="sortOrder"
            label="Tartib raqami"
            type="number"
            state={state}
            defaultValue={domain?.sortOrder ?? 0}
          />
        </div>
        <CheckboxField name="sold" label="Sotilgan" state={state} defaultChecked={domain?.sold ?? false} />
        <CheckboxField
          name="published"
          label="Saytda ko'rsatish"
          state={state}
          defaultChecked={domain?.published ?? true}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <SubmitButton pending={pending}>{domain ? "Saqlash" : "Qo'shish"}</SubmitButton>
        <Link href="/admin/domains" className="px-3 py-2 text-slate-600 hover:text-slate-900">
          Bekor qilish
        </Link>
      </div>
    </form>
  );
}
