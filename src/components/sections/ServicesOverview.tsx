import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/content/services";

export function ServicesOverview() {
  return (
    <section className="section bg-[var(--color-bg-alt)]">
      <div className="container-page">
        <SectionHeading
          overline="Hizmetler"
          title="Uçtan uca yapı pratiği."
          description="Fizibiliteden teslime, bir projenin her aşamasında tek sorumlu ekiple çalışırız."
        />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--color-border)]">
          {services.map((s, idx) => (
            <article
              key={s.id}
              className="bg-[var(--color-bg-alt)] p-8 md:p-12"
            >
              <div className="flex items-start gap-6">
                <span className="eyebrow mt-2">0{idx + 1}</span>
                <div>
                  <h3
                    className="text-2xl md:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-4 text-[var(--color-brand-soft)]">
                    {s.summary}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
