import type { Metadata } from "next";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "../globals.css";
import { fontClasses } from "@/lib/fonts";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

// The admin panel is its own root layout (the public site's is app/[lang]/layout.tsx) and is always Uzbek.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="uz" className={fontClasses}>
      <body className="min-h-screen bg-slate-100 font-sans text-slate-800">{children}</body>
    </html>
  );
}
