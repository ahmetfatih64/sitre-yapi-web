import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/content/services";

export function ServicesOverview() {
  return (
    <section className="section bg-[var(--color-bg-alt)]">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            overline="Hizmetler"
            title="Uçtan uca yapı pratiği."
            description="Fizibiliteden teslime, bir projenin her aşamasında tek sorumlu ekiple çalışırız."
          />
        </Reveal>

        {/* Kutu ızgarası yerine mimari bir indeks: numara, başlık, açıklama. */}
        <ul className="mt-14 lg:mt-20 border-t border-[var(--color-border)]">
          {services.map((service, index) => (
            <Reveal
              key={service.id}
              as="li"
              delay={index * 90}
              className="service-row"
            >
              <span className="service-row__n" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="service-row__title">{service.title}</h3>
              <p className="service-row__body">{service.summary}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
