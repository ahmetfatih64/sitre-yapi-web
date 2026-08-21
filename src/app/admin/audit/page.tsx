import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { can } from "@sitre/auth";
import { env } from "@/lib/env";
import { auditRepo, type AuditEntry } from "@sitre/db/repos/audit";

export const dynamic = "force-dynamic";

async function loadRows(): Promise<{ rows: AuditEntry[]; mode: "live" | "empty" }> {
  if (!env.HAS_DB) return { rows: [], mode: "empty" };
  try {
    const rows = await auditRepo.list(100);
    return { rows, mode: "live" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    console.warn("[admin/audit] repo unavailable:", message);
    return { rows: [], mode: "empty" };
  }
}

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!can(session.user.role, "audit.read")) redirect("/admin");

  const { rows, mode } = await loadRows();

  return (
    <section className="flex flex-col gap-6">
      <header>
        <p className="eyebrow mb-2">Yönetim</p>
        <h1 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          Denetim
        </h1>
        <p className="text-sm text-[var(--color-brand-soft)] mt-2 max-w-2xl">
          Aktör, eylem, varlık ve diff geçmişi.
        </p>
      </header>

      {mode === "empty" ? (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
          Denetim kayıtları DB sağlandığında görünür olacak.
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
          Henüz denetim kaydı yok.
        </div>
      ) : (
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface,#f7f6f3)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Zaman</th>
                <th className="px-4 py-3 font-medium">Aktör</th>
                <th className="px-4 py-3 font-medium">Eylem</th>
                <th className="px-4 py-3 font-medium">Varlık</th>
                <th className="px-4 py-3 font-medium">IP (hash)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--color-border)] align-top">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.createdAt.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {row.actorId ?? "—"}
                  </td>
                  <td className="px-4 py-3">{row.action}</td>
                  <td className="px-4 py-3">
                    {row.entity}
                    {row.entityId ? `:${row.entityId.slice(0, 8)}` : ""}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-brand-soft)] font-mono text-xs">
                    {row.ipHash ? row.ipHash.slice(0, 10) : "—"}
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
