import type { Metadata } from "next";
import Image from "next/image";
import { deleteProject, toggleProject } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/lib/db";
import { isOptimizableImage } from "@/lib/url";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Loyihalar" };

export default async function ProjectsPage() {
  await requireAdmin();
  const projects = await db.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      <PageHeader title="Loyihalar" action={{ href: "/admin/projects/new", label: "Qo'shish" }} />
      {projects.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">Hali loyiha qo&apos;shilmagan.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {projects.map((project) => (
            <li key={project.id} className="flex items-center gap-4 p-3 md:p-4">
              <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt=""
                    fill
                    sizes="96px"
                    unoptimized={!isOptimizableImage(project.imageUrl)}
                    className="object-cover object-top"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-800">
                  {project.title}
                  {!project.published && (
                    <span className="ml-2 whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500">
                      yashirin
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-slate-500">{project.description}</p>
              </div>
              <span className="hidden text-sm text-slate-400 sm:block">#{project.sortOrder}</span>
              <RowActions
                editHref={`/admin/projects/${project.id}`}
                published={project.published}
                onToggle={toggleProject.bind(null, project.id, !project.published)}
                onDelete={deleteProject.bind(null, project.id)}
                confirmText={`"${project.title}" loyihasini o'chirasizmi?`}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
