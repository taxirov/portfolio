import Image from "next/image";
import type { SocialLink } from "@/lib/generated/prisma/client";
import { getI18n } from "@/lib/locale";
import { getPlatform } from "@/lib/platforms";
import { profile } from "@/lib/profile";

export async function Hero({ socials }: { socials: SocialLink[] }) {
  const { dict } = await getI18n();
  return (
    <section
      id="home"
      className="grid min-h-svh grid-cols-1 items-center gap-8 pt-10 md:grid-cols-2 md:pt-24"
    >
      <div className="flex flex-col items-center gap-4 text-center md:items-start md:pl-8 md:text-left">
        <Image
          src="/images/hero.webp"
          alt={dict.hero.illustrationAlt}
          width={900}
          height={800}
          priority
          className="w-4/5 max-w-sm md:hidden"
        />
        <h1 className="text-4xl font-bold text-slate-800 sm:text-5xl lg:text-6xl xl:text-7xl">{profile.name}</h1>
        <p className="text-xl font-semibold uppercase tracking-wide text-slate-500 sm:text-2xl">
          {dict.profile.jobTitle}
        </p>
        {socials.length > 0 && (
          <ul className="flex gap-1">
            {socials.map((social) => {
              const platform = getPlatform(social.platform);
              return (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label || platform.label}
                    className={`p-1 text-2xl text-slate-800 transition-colors ${platform.hover}`}
                  >
                    <i className={`bi ${platform.icon}`} aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="#portfolio"
            className="rounded-lg bg-indigo-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-600"
          >
            {dict.hero.viewProjects}
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-slate-300 bg-white/60 px-5 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-white"
          >
            {dict.hero.contactMe}
          </a>
        </div>
      </div>
      <div className="hidden justify-center md:flex">
        <Image
          src="/images/hero.webp"
          alt={dict.hero.illustrationAlt}
          width={900}
          height={800}
          priority
          className="w-3/4"
        />
      </div>
    </section>
  );
}
