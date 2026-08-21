import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { can } from "@sitre/auth";
import { env } from "@/lib/env";
import { leadRepo, type LeadListItem } from "@sitre/db/repos/lead";
import { LeadRow } from "./LeadRow";

export const dynamic = "force-dynamic";

async function loadLeads(): Promise<{ rows: LeadListItem[]; mode: "live" | "empty" }> {
  if (!env.HAS_DB) return { rows: [], mode: "empty" };
  try {
    const rows = await leadRepo.list({ limit: 50 });
    return { rows, mode: "live" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    console.warn("[admin/leads] repo unavailable:", message);
    return { rows: [], mode: "empty" };
  }
}

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!can(session.user.role, "lead.read")) redirect("/admin");

  const { rows, mode } = await loadLeads();

  return (
    <section className="flex flex-col gap-6">
      <header>
        <p className="eyebrow mb-2">Yönetim</p>
        <h1 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          Talepler
        </h1>
        <p className="text-sm text-[var(--color-brand-soft)] mt-2 max-w-2xl">
          Web formundan gelen talepler, atama ve durum geçişleri.
        </p>
      </header>

      {mode === "empty" ? (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
          Veritabanı henüz bağlı değil.
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
          Henüz kayıtlı talep bulunmuyor.
        </div>
      ) : (
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface,#f7f6f3)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">İsim</th>
                <th className="px-4 py-3 font-medium">İletişim</th>
                <th className="px-4 py-3 font-medium">Proje</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Atanan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <LeadRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
