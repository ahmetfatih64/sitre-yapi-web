import type { Metadata } from "next";
import { kvkkDoc } from "@/content/legal/kvkk";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "KVKK Aydınlatma Metni",
  path: "/kvkk",
  description:
    "Sitre Yapı KVKK aydınlatma metni — kişisel verilerin işlenmesi hakkında bilgilendirme.",
});

export default function KvkkPage() {
  return (
    <article className="section pt-40">
      <div className="container-page max-w-3xl">
        <p className="eyebrow mb-5">Yasal</p>
        <h1 className="display-lg">{kvkkDoc.title}</h1>
        <p className="text-sm text-[var(--color-muted)] mt-4">
          Son güncelleme: {kvkkDoc.updatedAt}
        </p>
        <div
          className="mt-12 prose-legal flex flex-col gap-5 text-[var(--color-brand-soft)]"
          dangerouslySetInnerHTML={{ __html: kvkkDoc.bodyHtml }}
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
