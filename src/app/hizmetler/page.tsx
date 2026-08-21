import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hizmetler",
  path: "/hizmetler",
  description:
    "Sitre Yapı'nın sunduğu hizmet alanları: proje geliştirme, mimari danışmanlık, yapım ve taahhüt, yatırım danışmanlığı.",
});

export default function HizmetlerPage() {
  return (
    <>
      <section className="section pt-40">
        <div className="container-page">
          <SectionHeading
            overline="Hizmetler"
            title="Uçtan uca yapı pratiği."
            description="Fizibiliteden teslime kadar, bir projenin her aşamasında tek sorumlu ekiple çalışırız."
            as="h1"
            size="xl"
          />
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="grid gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
            {services.map((s, i) => (
              <article
                key={s.id}
                className="bg-white p-8 md:p-12 grid md:grid-cols-12 gap-8 items-start"
              >
                <div className="md:col-span-2 eyebrow">0{i + 1}</div>
                <div className="md:col-span-4">
                  <h2
                    className="display-md"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.title}
                  </h2>
                </div>
                <div className="md:col-span-6">
                  <p className="text-[var(--color-brand-soft)]">{s.summary}</p>
                  <p className="mt-4 text-sm text-[var(--color-muted)]">
                    {s.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        overline="Görüşme"
        title="Bir projeyi beraber değerlendirelim."
        description="İlk görüşme bağlayıcı değildir; sizi dinleriz, yön öneririz."
        primaryLabel="Görüşme talep et"
        secondaryLabel="Projelerimiz"
        secondaryHref="/projeler"
      />
    </>
  );
}
