import type { Metadata } from "next";
import { gizlilikDoc } from "@/content/legal/gizlilik";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gizlilik Politikası",
  path: "/gizlilik",
  description:
    "Sitre Yapı Gizlilik Politikası — web sitemiz üzerinden topladığımız bilgilerin nasıl işlendiğini açıklar.",
});

export default function GizlilikPage() {
  return (
    <article className="section pt-40">
      <div className="container-page max-w-3xl">
        <p className="eyebrow mb-5">Yasal</p>
        <h1 className="display-lg">{gizlilikDoc.title}</h1>
        <p className="text-sm text-[var(--color-muted)] mt-4">
          Son güncelleme: {gizlilikDoc.updatedAt}
        </p>
        <div
          className="mt-12 prose-legal flex flex-col gap-5 text-[var(--color-brand-soft)]"
          dangerouslySetInnerHTML={{ __html: gizlilikDoc.bodyHtml }}
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
        .prose-legal table { width: 100%; border-collapse: collapse; margin-block: 1rem; font-size: 0.875rem; }
        .prose-legal th, .prose-legal td { border: 1px solid var(--color-border); padding: 0.5rem 0.75rem; text-align: left; }
      `}</style>
    </article>
  );
}
