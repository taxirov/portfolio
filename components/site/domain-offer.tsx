"use client";

import { useActionState, useRef } from "react";
import { sendDomainOffer, type OfferState } from "@/app/actions";
import type { Dictionary } from "@/lib/dictionaries";
import { fill, type Locale } from "@/lib/i18n";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 aria-[invalid=true]:border-red-400";

type Field = "name" | "email" | "offer" | "message";

function Errors({ state, name }: { state: OfferState; name: Field }) {
  return state?.fieldErrors?.[name]?.map((error) => (
    <p key={error} className="text-sm font-normal text-red-600">
      {error}
    </p>
  ));
}

type Props = {
  domainId: string;
  domain: string;
  currency: string;
  locale: Locale;
  dict: Dictionary["domains"];
  contact: Dictionary["contact"];
};

/** "Make an offer" button with its form in a native <dialog> (Esc and focus handling come for free). */
export function DomainOffer({ domainId, domain, currency, locale, dict, contact }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, formAction, pending] = useActionState(sendDomainOffer.bind(null, domainId), undefined);
  const invalid = (name: Field) => !!state?.fieldErrors?.[name];
  const title = fill(dict.offerTitle, { domain });

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        <i className="bi bi-cash-coin" aria-hidden /> {dict.makeOffer}
      </button>

      <dialog
        ref={dialog}
        aria-label={title}
        // Clicking the backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(event) => event.target === dialog.current && dialog.current.close()}
        className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-2xl bg-white p-0 shadow-xl backdrop:bg-slate-900/50"
      >
        <div className="flex flex-col gap-4 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label={dict.close}
              className="rounded-md p-1 text-xl leading-none text-slate-400 hover:text-slate-700"
            >
              <i className="bi bi-x-lg" aria-hidden />
            </button>
          </div>

          {state?.ok ? (
            <p role="status" className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-3 text-emerald-800">
              <i className="bi bi-check-circle-fill" aria-hidden /> {fill(dict.thanks, { domain })}
            </p>
          ) : (
            <form action={formAction} className="flex flex-col gap-4" noValidate>
              <input type="hidden" name="lang" value={locale} />
              {state?.error && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {state.error}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                  {contact.name}
                  <input
                    name="name"
                    autoComplete="name"
                    maxLength={80}
                    defaultValue={state?.values?.name}
                    aria-invalid={invalid("name")}
                    className={inputClass}
                  />
                  <Errors state={state} name="name" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                  {contact.email}
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={200}
                    defaultValue={state?.values?.email}
                    aria-invalid={invalid("email")}
                    className={inputClass}
                  />
                  <Errors state={state} name="email" />
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                {fill(dict.yourOffer, { currency })}
                <input
                  name="offer"
                  inputMode="numeric"
                  maxLength={20}
                  defaultValue={state?.values?.offer}
                  aria-invalid={invalid("offer")}
                  className={inputClass}
                />
                <Errors state={state} name="offer" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                <span>
                  {dict.message} <span className="font-normal text-slate-400">({dict.optional})</span>
                </span>
                <textarea
                  name="message"
                  rows={4}
                  maxLength={3000}
                  placeholder={dict.messagePlaceholder}
                  defaultValue={state?.values?.message}
                  aria-invalid={invalid("message")}
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
                <i className="bi bi-send" aria-hidden /> {pending ? contact.sending : contact.send}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
