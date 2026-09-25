import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";
import type { Project } from "@/lib/generated/prisma/client";
import { fill, pick, t, type Locale } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { isOptimizableImage } from "@/lib/url";
import { SectionTitle } from "./section-title";

export async function Projects({ projects }: { projects: Project[] }) {
  const { locale, dict } = await getI18n();
  return (
    <section id="portfolio" className="flex flex-col gap-4 pt-12 md:pt-24">
      <SectionTitle>{dict.projects.title}</SectionTitle>
      {projects.length === 0 ? (
        <p className="rounded-xl bg-white/60 p-6 text-slate-500">{dict.projects.comingSoon}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} dict={dict.projects} />
          ))}
        </div>
      )}
    </section>
  );
}

type CardProps = { project: Project; locale: Locale; dict: Dictionary["projects"] };

function ProjectCard({ project, locale, dict }: CardProps) {
  const title = t(project, "title", locale);
  const description = pick(project, "description", locale);
  const note = pick(project, "note", locale);
  const links = [
    project.repoUrl && {
      href: project.repoUrl,
      label: project.frontendRepoUrl ? dict.backend : dict.sourceCode,
      icon: "bi-github",
    },
    project.frontendRepoUrl && { href: project.frontendRepoUrl, label: dict.frontend, icon: "bi-github" },
    project.demoUrl && { href: project.demoUrl, label: dict.liveDemo, icon: "bi-eye", primary: true },
  ].filter(Boolean) as { href: string; label: string; icon: string; primary?: boolean }[];

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-stone-50 shadow-sm">
      <div className="relative aspect-video bg-slate-200">
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={fill(dict.screenshot, { title })}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized={!isOptimizableImage(project.imageUrl)}
            className="object-cover object-top"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 text-slate-700">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p lang={description.lang} className="whitespace-pre-line">
          {description.text}
        </p>
        {project.backendStack && (
          <p className="text-sm">
            <i className="bi bi-hdd-stack" aria-hidden /> <b>{dict.backend}:</b> {project.backendStack}
          </p>
        )}
        {project.frontendStack && (
          <p className="text-sm">
            <i className="bi bi-window" aria-hidden /> <b>{dict.frontend}:</b> {project.frontendStack}
          </p>
        )}
        {note.text && (
          <p lang={note.lang} className="text-sm text-slate-500">
            <i className="bi bi-info-circle" aria-hidden /> {note.text}
          </p>
        )}
        {links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 rounded-md px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors ${
                  link.primary ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-800 hover:bg-slate-900"
                }`}
              >
                <i className={`bi ${link.icon}`} aria-hidden /> {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
