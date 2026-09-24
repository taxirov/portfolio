"use client";

import Link from "next/link";
import { useTransition } from "react";

type Props = {
  editHref: string;
  published: boolean;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
  confirmText: string;
};

export function RowActions({ editHref, published, onToggle, onDelete, confirmText }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className={`flex items-center gap-1 ${pending ? "pointer-events-none opacity-50" : ""}`}>
      <button
        type="button"
        onClick={() => startTransition(onToggle)}
        title={published ? "Yashirish" : "Ko'rsatish"}
        aria-label={published ? "Yashirish" : "Ko'rsatish"}
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      >
        <i className={`bi ${published ? "bi-eye" : "bi-eye-slash"}`} aria-hidden />
      </button>
      <Link
        href={editHref}
        title="Tahrirlash"
        aria-label="Tahrirlash"
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
      >
        <i className="bi bi-pencil" aria-hidden />
      </Link>
      <button
        type="button"
        onClick={() => {
          if (confirm(confirmText)) startTransition(onDelete);
        }}
        title="O'chirish"
        aria-label="O'chirish"
        className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
      >
        <i className="bi bi-trash" aria-hidden />
      </button>
    </div>
  );
}
