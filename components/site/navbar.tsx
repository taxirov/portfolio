import Image from "next/image";
import Link from "next/link";
import { getI18n } from "@/lib/locale";
import { profile } from "@/lib/profile";
import { LanguageSwitcher } from "./language-switcher";

export async function Navbar() {
  const { locale, dict } = await getI18n();
  const home = `/${locale}`;
  // Absolute "/{lang}#..." links so the navbar also works on blog pages.
  const links = [
    { href: `${home}#home`, label: dict.nav.home, icon: "bi-house" },
    { href: `${home}#skills`, label: dict.nav.skills, icon: "bi-code-square", desktopOnly: true },
    { href: `${home}#portfolio`, label: dict.nav.portfolio, icon: "bi-folder" },
    { href: `${home}/blogs`, label: dict.nav.blog, icon: "bi-journal-text" },
    { href: `${home}/domains`, label: dict.nav.domains, icon: "bi-globe", desktopOnly: true },
    { href: `${home}#about`, label: dict.nav.about, icon: "bi-person" },
    { href: `${home}#contact`, label: dict.nav.contact, icon: "bi-chat-dots" },
  ];

  return (
    <>
      {/* Desktop */}
      <header className="fixed inset-x-4 top-5 z-40 mx-auto hidden max-w-6xl items-center justify-between gap-4 rounded-xl bg-white/40 px-4 py-2 shadow-sm backdrop-blur-md lg:flex">
        <Link href={home} aria-label={dict.nav.homeLabel}>
          <Image src="/images/avatar.webp" alt="" width={32} height={32} className="rounded-full" />
        </Link>
        <nav className="flex items-center gap-4 text-slate-700 lg:gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="font-medium transition-colors hover:text-indigo-600">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={dict.nav.language} />
          <a
            href={`mailto:${profile.email}`}
            className="rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-indigo-600"
          >
            <i className="bi bi-envelope-fill" aria-hidden /> {dict.nav.email}
          </a>
        </div>
      </header>

      {/* Phones and tablets: language switcher top right, navigation as a bottom bar */}
      <LanguageSwitcher
        locale={locale}
        label={dict.nav.language}
        className="fixed right-3 top-3 z-40 shadow-sm backdrop-blur-md lg:hidden"
      />
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around bg-slate-700 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
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
