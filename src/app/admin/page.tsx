import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ROLE_PERMISSIONS } from "@sitre/auth";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const perms = ROLE_PERMISSIONS[session.user.role];

  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="eyebrow mb-2">Yönetim Paneli</p>
        <h1 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          Hoş geldin, {session.user.name ?? session.user.email}
        </h1>
        <p className="text-sm text-[var(--color-brand-soft)] mt-2">
          Bu panel, içerik, talep ve medya yönetimi için merkezi yüzeydir.
          Üretim ortamına geçiş için DATABASE_URL ve NEXTAUTH_SECRET sağlandığında
          oturum iskeleti gerçek auth'a bağlanır.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Yayın bekleyen taslaklar" hint="DRAFT / IN_REVIEW projeleri" value="—" />
        <Card title="Yeni talepler (24s)" hint="WEB_FORM kanalı" value="—" />
        <Card title="Atanmamış talepler" hint="status=NEW" value="—" />
      </div>

      <details className="bg-white border border-[var(--color-border)] rounded-xl p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Bu rolün izinleri ({perms.length})
        </summary>
        <ul className="mt-3 grid grid-cols-2 gap-1 text-xs text-[var(--color-brand-soft)]">
          {perms.map((p) => (
            <li key={p} className="font-mono">{p}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}

function Card({ title, hint, value }: { title: string; hint: string; value: string }) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
      <p className="text-xs uppercase tracking-wider text-[var(--color-brand-soft)]">
        {title}
      </p>
      <p className="text-3xl mt-2" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <p className="text-xs text-[var(--color-brand-soft)] mt-1">{hint}</p>
    </div>
  );
}
