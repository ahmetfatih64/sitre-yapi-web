import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { can } from "@sitre/auth";
import Link from "next/link";
import { env } from "@/lib/env";
import { projectRepo, type ProjectListItem } from "@sitre/db/repos/project";

export const dynamic = "force-dynamic";

const PUBLISH_LABEL: Record<string, string> = {
  DRAFT: "Taslak",
  IN_REVIEW: "İncelemede",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşiv",
};

async function loadRows(): Promise<{ rows: ProjectListItem[]; mode: "live" | "empty" }> {
  if (!env.HAS_DB) return { rows: [], mode: "empty" };
  try {
    const rows = await projectRepo.listForAdmin();
    return { rows, mode: "live" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    console.warn("[admin/projects] repo unavailable:", message);
    return { rows: [], mode: "empty" };
  }
}

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!can(session.user.role, "project.read")) redirect("/admin");

  const { rows, mode } = await loadRows();
  const canDraft = can(session.user.role, "project.draft");

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Yönetim</p>
          <h1 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
            Projeler
          </h1>
          <p className="text-sm text-[var(--color-brand-soft)] mt-2 max-w-2xl">
            Taslak → İncelemede → Yayında akışı, revizyon geçmişi ve yayın projeksiyonu.
          </p>
        </div>
        {canDraft && (
          <Link
            href="/admin/projects/new"
            className="bg-[var(--color-brand,#0a0a0a)] text-white rounded px-4 py-2 text-sm whitespace-nowrap"
          >
            Yeni proje
          </Link>
        )}
      </header>

      {mode === "empty" ? (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
          Veritabanı henüz bağlı değil. <code className="font-mono">DATABASE_URL</code>{" "}
          tanımlandığında projeler burada listelenecek.
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
          Henüz proje kaydı yok.
        </div>
      ) : (
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface,#f7f6f3)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Ad</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Yayın</th>
                <th className="px-4 py-3 font-medium">Güncellendi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/projects/${row.id}`}
                      className="underline"
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{row.slug}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3">
                    {PUBLISH_LABEL[row.publishState] ?? row.publishState}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.updatedAt.toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
