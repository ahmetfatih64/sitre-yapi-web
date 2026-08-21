import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { can } from "@sitre/auth";
import { env } from "@/lib/env";
import { projectRepo } from "@sitre/db/repos/project";
import { mediaRepo } from "@sitre/db/repos/media";
import { ProjectEditor } from "./ProjectEditor";
import { MediaGallery } from "./MediaGallery";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!can(session.user.role, "project.read")) redirect("/admin");

  const { id } = await params;

  if (!env.HAS_DB) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          Proje düzenleyici
        </h1>
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
          Veritabanı bağlı olmadığı için düzenleyici devre dışı.
        </div>
      </section>
    );
  }

  const draft = await projectRepo.getDraft(id).catch(() => null);
  if (!draft) notFound();

  const media = await mediaRepo.listForProject(draft.id).catch(() => []);

  return (
    <section className="flex flex-col gap-8">
      <header>
        <p className="eyebrow mb-2">Proje</p>
        <h1 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          {draft.name}
        </h1>
        <p className="text-sm text-[var(--color-brand-soft)] font-mono mt-1">
          {draft.slug}
        </p>
      </header>
      <ProjectEditor draft={draft} />
      <MediaGallery projectId={draft.id} items={media} />
    </section>
  );
}
