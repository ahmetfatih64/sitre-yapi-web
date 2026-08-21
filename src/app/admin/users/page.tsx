import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { can } from "@sitre/auth";
import { env } from "@/lib/env";
import { userRepo, type UserListItem } from "@sitre/db/repos/user";
import { UserRow } from "./UserRow";

export const dynamic = "force-dynamic";

async function loadRows(): Promise<{ rows: UserListItem[]; mode: "live" | "empty" }> {
  if (!env.HAS_DB) return { rows: [], mode: "empty" };
  try {
    const rows = await userRepo.list();
    return { rows, mode: "live" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    console.warn("[admin/users] repo unavailable:", message);
    return { rows: [], mode: "empty" };
  }
}

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!can(session.user.role, "user.read")) redirect("/admin");

  const canMutate = can(session.user.role, "user.update_role");
  const { rows, mode } = await loadRows();

  return (
    <section className="flex flex-col gap-6">
      <header>
        <p className="eyebrow mb-2">Yönetim</p>
        <h1 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          Kullanıcılar
        </h1>
        <p className="text-sm text-[var(--color-brand-soft)] mt-2 max-w-2xl">
          Rol ataması ve devre dışı bırakma yalnızca OWNER yetkisiyle uygulanır.
        </p>
      </header>

      {mode === "empty" ? (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
          Kullanıcı dizini Auth.js + Prisma sağlandığında listelenecek.
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
          Henüz kullanıcı yok.
        </div>
      ) : (
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface,#f7f6f3)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">E-posta</th>
                <th className="px-4 py-3 font-medium">İsim</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Eklendi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <UserRow
                  key={row.id}
                  row={row}
                  currentUserId={session.user.id}
                  canMutate={canMutate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
