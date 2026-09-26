"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { FormState } from "@/app/admin/actions";

/** Goes to state.redirectTo after a successful save (admin actions return it instead of redirecting). */
export function useFormRedirect(state: FormState) {
  const router = useRouter();
  const target = state?.redirectTo;
  useEffect(() => {
    if (target) router.push(target);
  }, [target, router]);
}
