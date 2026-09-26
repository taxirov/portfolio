"use client";

import { useTransition } from "react";
import { logout } from "@/app/admin/actions";

/** Full page load afterwards, so nothing from the signed-in session stays in the client router. */
export function LogoutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await logout();
          // Deliberately a full load rather than router.push (see the comment above).
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.assign("/admin/login");
        })
      }
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-red-600 disabled:opacity-60"
    >
      <i className="bi bi-box-arrow-left" aria-hidden /> Chiqish
    </button>
  );
}
