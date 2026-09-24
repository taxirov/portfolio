import Image from "next/image";
import Link from "next/link";
import { profile } from "@/lib/profile";

// Absolute "/#..." links so the navbar also works on /blogs pages.
const links = [
  { href: "/#home", label: "Home", icon: "bi-house" },
  { href: "/#skills", label: "Skills", icon: "bi-code-square", desktopOnly: true },
  { href: "/#portfolio", label: "Portfolio", icon: "bi-folder" },
  { href: "/blogs", label: "Blog", icon: "bi-journal-text" },
  { href: "/#about", label: "About", icon: "bi-person" },
  { href: "/#contact", label: "Contact", icon: "bi-chat-dots" },
];

export function Navbar() {
  return (
    <>
      {/* Desktop / tablet */}
      <header className="fixed inset-x-4 top-5 z-40 mx-auto hidden max-w-6xl items-center justify-between rounded-xl bg-white/40 px-4 py-2 shadow-sm backdrop-blur-md md:flex">
        <Link href="/" aria-label={`${profile.name}, home`}>
          <Image src="/images/avatar.webp" alt="" width={32} height={32} className="rounded-full" />
        </Link>
        <nav className="flex items-center gap-5 text-slate-700 lg:gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="font-medium transition-colors hover:text-indigo-600">
              {link.label}
            </Link>
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
        {links
          .filter((link) => !link.desktopOnly)
          .map((link) => (
            <Link key={link.href} href={link.href} className="flex flex-col items-center px-1 py-1 text-slate-100">
              <i className={`bi ${link.icon} text-xl`} aria-hidden />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          ))}
      </nav>
    </>
  );
}
