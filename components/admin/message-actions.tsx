"use client";

import { useTransition } from "react";

type Props = {
  read: boolean;
  replyHref: string;
  onToggleRead: () => Promise<void>;
  onDelete: () => Promise<void>;
};

export function MessageActions({ read, replyHref, onToggleRead, onDelete }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${pending ? "pointer-events-none opacity-50" : ""}`}>
      <a
        href={replyHref}
        onClick={() => {
          if (!read) startTransition(onToggleRead);
        }}
        className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
      >
        <i className="bi bi-reply" aria-hidden /> Javob berish
      </a>
      <button
        type="button"
        onClick={() => startTransition(onToggleRead)}
        className="rounded-md bg-slate-100 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-200"
      >
        {read ? "O'qilmagan deb belgilash" : "O'qildi"}
      </button>
      <button
        type="button"
        onClick={() => {
          if (confirm("Xabarni o'chirasizmi?")) startTransition(onDelete);
        }}
        className="rounded-md px-3 py-1.5 font-medium text-red-600 hover:bg-red-50"
      >
        <i className="bi bi-trash" aria-hidden /> O&apos;chirish
      </button>
    </div>
  );
}
