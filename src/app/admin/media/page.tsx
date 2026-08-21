import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { can } from "@sitre/auth";
import { env } from "@/lib/env";
import { MediaUploader } from "./MediaUploader";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!can(session.user.role, "media.upload")) redirect("/admin");

  const adapter = env.HAS_R2 ? "Cloudflare R2" : "Yerel dosya sistemi (dev)";

  return (
    <section className="flex flex-col gap-6">
      <header>
        <p className="eyebrow mb-2">Yönetim</p>
        <h1 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          Medya
        </h1>
        <p className="text-sm text-[var(--color-brand-soft)] mt-2 max-w-2xl">
          İmzalı yükleme uç noktası aktif. Aktif depo:{" "}
          <span className="font-mono">{adapter}</span>.
        </p>
      </header>

      <MediaUploader />

      <p className="text-xs text-[var(--color-brand-soft)]">
        Not: Yüklenen dosya hash'i, MIME doğrulaması ve projeksiyon eşleştirmesi
        bir sonraki sprintte <code className="font-mono">MediaAttachment</code>{" "}
        modeline yazılacak.
      </p>
    </section>
  );
}
