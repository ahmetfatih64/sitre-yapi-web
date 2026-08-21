import { getSession } from "@/lib/auth/session";
import { can, type Permission } from "@sitre/auth";
import { redirect } from "next/navigation";

export async function Placeholder({
  perm,
  title,
  description,
}: {
  perm: Permission;
  title: string;
  description: string;
}) {
  const session = (await getSession())!;
  if (!can(session.user.role, perm)) redirect("/admin");

  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="eyebrow mb-2">Yönetim</p>
        <h1 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h1>
        <p className="text-sm text-[var(--color-brand-soft)] mt-2 max-w-2xl">
          {description}
        </p>
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
        Bu modül iskelet aşamasındadır. Veri katmanı{" "}
        <code className="font-mono">@sitre/db</code> üzerinden bağlandığında
        liste, filtre ve detay görünümleri açılacaktır.
      </div>
    </section>
  );
}
