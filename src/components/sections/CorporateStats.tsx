import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountUpValue } from "@/components/ui/CountUpValue";
import { siteConfig } from "@/content/site.config";

const stats = [
  { value: "12+", label: "Yıllık deneyim" },
  { value: "%100", label: "Müşteri memnuniyeti" },
  { value: "A'dan Z'ye", label: "Anahtar teslim proje" },
  { value: "Uşak", label: "Yerel güç, güvenilir iş" },
];

export function CorporateStats() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              overline="Sitre Yapı"
              title="Az ve doğru iş, uzun vadeli güven."
              description="Sitre Yapı, az sayıda ama derinlemesine düşünülmüş projelerle ilerleyen bir yapı markasıdır. Hedefimiz, teslimden sonra da sahiplenebileceğimiz mekanlar üretmektir."
            />
            <Link href="/hakkimizda" className="btn btn-outline mt-10">
              Hakkımızda
            </Link>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-7">
            <dl className="stat-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-cell">
                  <dt className="eyebrow">{stat.label}</dt>
                  <dd className="stat-cell__value">
                    <CountUpValue value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>

            {/* Büyük firmalar ölçekle güven kurar; yerel bir ofiste bunu
                muhatabın kim olduğu kurar. */}
            <div className="founders">
              <p className="eyebrow">Muhatabınız</p>
              <ul className="founders__list">
                {siteConfig.founders.map((person) => (
                  <li key={person.phoneHref} className="founders__item">
                    <span className="founders__name">{person.name}</span>
                    <a href={person.phoneHref} className="founders__phone">
                      {person.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
