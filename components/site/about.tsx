import type { SocialLink } from "@/lib/generated/prisma/client";
import { getPlatform } from "@/lib/platforms";
import { profile } from "@/lib/profile";
import { SectionTitle } from "./section-title";

const facts = [
  { icon: "bi-person-fill", label: "Full name", value: profile.fullName },
  { icon: "bi-geo-alt-fill", label: "Address", value: profile.address },
  { icon: "bi-briefcase-fill", label: "Job title", value: profile.title },
  { icon: "bi-envelope-fill", label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: "bi-telephone-fill", label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
];

const leetcodeBadge =
  "https://img.shields.io/badge/dynamic/json?style=for-the-badge&labelColor=black&color=%23ffa116&label=Ranking&query=ranking&logo=leetcode&logoColor=yellow&url=" +
  encodeURIComponent(`https://leetcode-badge.vercel.app/api/users/${profile.leetcodeUser}`);

export function About({ socials }: { socials: SocialLink[] }) {
  return (
    <section id="about" className="flex flex-col gap-4 pt-12 md:pt-24">
      <SectionTitle>About</SectionTitle>
      <div className="flex flex-col gap-6 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:justify-between">
        <dl className="flex flex-col gap-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex gap-2">
              <i className={`bi ${fact.icon}`} aria-hidden />
              <dt className="font-semibold">{fact.label}:</dt>
              <dd className="font-medium">
                {fact.href ? (
                  <a href={fact.href} className="hover:text-indigo-600">
                    {fact.value}
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-medium">Coding</h3>
          {/* Third-party badge images: keep them as plain <img>. */}
          <a href={`https://www.codewars.com/users/${profile.codewarsUser}`} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://www.codewars.com/users/${profile.codewarsUser}/badges/large`}
              alt="Codewars profile badge"
              loading="lazy"
            />
          </a>
          <a href={`https://leetcode.com/u/${profile.leetcodeUser}`} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={leetcodeBadge} alt="LeetCode ranking badge" loading="lazy" />
          </a>
        </div>
      </div>

      {socials.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-xl font-medium">Find me online</h3>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {socials.map((social) => {
              const platform = getPlatform(social.platform);
              const name = social.label || platform.label;
              return (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={name}
                    aria-label={name}
                    className={`flex items-center justify-center rounded-xl px-5 py-4 text-3xl text-white transition-transform hover:-translate-y-0.5 ${platform.tile}`}
                  >
                    <i className={`bi ${platform.icon}`} aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
