/* eslint-disable react/no-danger --
 * Yasal metin src/content/legal/ altındaki statik TS sabitinden geliyor.
 * Kullanıcı girdisi bu HTML'e hiç ulaşmıyor, bu yüzden XSS yüzeyi yok.
 */
import type { Metadata } from "next";
import { cerezDoc } from "@/content/legal/cerez-politikasi";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Çerez Politikası",
  path: "/cerez-politikasi",
  description:
    "Sitre Yapı çerez politikası — çerez türleri ve tercih yönetimi.",
});

export default function CerezPage() {
  return (
    <article className="section pt-40">
      <div className="container-page max-w-3xl">
        <p className="eyebrow mb-5">Yasal</p>
        <h1 className="display-lg">{cerezDoc.title}</h1>
        <p className="text-sm text-[var(--color-muted)] mt-4">
          Son güncelleme: {cerezDoc.updatedAt}
        </p>
        <div
          className="mt-12 prose-legal flex flex-col gap-5 text-[var(--color-brand-soft)]"
          dangerouslySetInnerHTML={{ __html: cerezDoc.bodyHtml }}
        />
      </div>
      <style>{`
        .prose-legal h2 {
          margin-top: 2rem;
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
          color: var(--color-brand);
        }
        .prose-legal ul { list-style: disc; padding-left: 1.25rem; }
        .prose-legal li { margin-block: 0.25rem; }
      `}</style>
    </article>
  );
}
