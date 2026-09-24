import Image from "next/image";
import { profile } from "@/lib/profile";

const links = [
  { href: "#home", label: "Home", icon: "bi-house" },
  { href: "#skills", label: "Skills", icon: "bi-code-square" },
  { href: "#portfolio", label: "Portfolio", icon: "bi-folder" },
  { href: "#about", label: "About", icon: "bi-person" },
];

export function Navbar() {
  return (
    <>
      {/* Desktop / tablet */}
      <header className="fixed inset-x-4 top-5 z-40 mx-auto hidden max-w-6xl items-center justify-between rounded-xl bg-white/40 px-4 py-2 shadow-sm backdrop-blur-md md:flex">
        <a href="#home" aria-label="Home">
          <Image src="/images/avatar.webp" alt={profile.name} width={32} height={32} className="rounded-full" />
        </a>
        <nav className="flex items-center gap-6 text-slate-700">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="font-medium transition-colors hover:text-indigo-600">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={`mailto:${profile.email}`}
          className="rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-indigo-600"
        >
          <i className="bi bi-envelope-fill" aria-hidden /> Email
        </a>
      </header>

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around bg-slate-700 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="flex flex-col items-center px-2 py-1 text-slate-100">
            <i className={`bi ${link.icon} text-xl`} aria-hidden />
            <span className="text-xs font-medium">{link.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
