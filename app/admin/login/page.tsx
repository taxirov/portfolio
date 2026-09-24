import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Kirish" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/images/avatar.webp" alt="" width={40} height={40} className="rounded-full" />
          <div>
            <h1 className="text-lg font-semibold">Admin panel</h1>
            <p className="text-sm text-slate-500">saad.uz boshqaruvi</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
