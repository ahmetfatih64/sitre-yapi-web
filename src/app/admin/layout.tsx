import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { can } from "@sitre/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim Paneli — Sitre Yapı",
  robots: { index: false, follow: false, nocache: true },
};

const NAV: { href: string; label: string; perm: Parameters<typeof can>[1] }[] = [
  { href: "/admin", label: "Özet", perm: "project.read" },
  { href: "/admin/projects", label: "Projeler", perm: "project.read" },
  { href: "/admin/leads", label: "Talepler", perm: "lead.read" },
  { href: "/admin/media", label: "Medya", perm: "media.upload" },
  { href: "/admin/users", label: "Kullanıcılar", perm: "user.read" },
  { href: "/admin/audit", label: "Denetim", perm: "audit.read" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const role = session.user.role;
  const items = NAV.filter((n) => can(role, n.perm));

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-brand)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/admin" className="font-medium" style={{ fontFamily: "var(--font-display)" }}>
            Sitre · Yönetim
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[var(--color-brand-soft)]">{session.user.email}</span>
            <span className="px-2 py-0.5 rounded bg-[var(--color-surface)] text-xs uppercase tracking-wider">
              {role}
            </span>
          </div>
        </div>
      </header>
      <div className="container-page grid grid-cols-12 gap-8 py-8">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {items.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-2 rounded-lg text-sm hover:bg-white whitespace-nowrap"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="col-span-12 md:col-span-9 lg:col-span-10 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
