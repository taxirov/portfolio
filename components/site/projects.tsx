import Image from "next/image";
import type { Project } from "@/lib/generated/prisma/client";
import { isOptimizableImage } from "@/lib/url";
import { SectionTitle } from "./section-title";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="portfolio" className="flex flex-col gap-4 pt-12 md:pt-24">
      <SectionTitle>Portfolio</SectionTitle>
      {projects.length === 0 ? (
        <p className="rounded-xl bg-white/60 p-6 text-slate-500">Projects are coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const links = [
    project.repoUrl && {
      href: project.repoUrl,
      label: project.frontendRepoUrl ? "Backend" : "Source code",
      icon: "bi-github",
    },
    project.frontendRepoUrl && { href: project.frontendRepoUrl, label: "Frontend", icon: "bi-github" },
    project.demoUrl && { href: project.demoUrl, label: "Live demo", icon: "bi-eye", primary: true },
  ].filter(Boolean) as { href: string; label: string; icon: string; primary?: boolean }[];

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-stone-50 shadow-sm">
      <div className="relative aspect-video bg-slate-200">
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized={!isOptimizableImage(project.imageUrl)}
            className="object-cover object-top"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 text-slate-700">
        <h3 className="text-lg font-semibold text-slate-800">{project.title}</h3>
        <p className="whitespace-pre-line">{project.description}</p>
        {project.backendStack && (
          <p className="text-sm">
            <i className="bi bi-hdd-stack" aria-hidden /> <b>Backend:</b> {project.backendStack}
          </p>
        )}
        {project.frontendStack && (
          <p className="text-sm">
            <i className="bi bi-window" aria-hidden /> <b>Frontend:</b> {project.frontendStack}
          </p>
        )}
        {project.note && (
          <p className="text-sm text-slate-500">
            <i className="bi bi-info-circle" aria-hidden /> {project.note}
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
