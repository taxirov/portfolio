import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveProject } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Loyihani tahrirlash" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <PageHeader title={project.title} back="/admin/projects" />
      <ProjectForm action={saveProject.bind(null, project.id)} project={project} />
    </>
  );
}
