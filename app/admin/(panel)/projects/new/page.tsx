import type { Metadata } from "next";
import { saveProject } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Yangi loyiha" };

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Yangi loyiha" back="/admin/projects" />
      <ProjectForm action={saveProject.bind(null, null)} />
    </>
  );
}
