import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stats = [
  { value: "12+", label: "Yıllık deneyim" },
  { value: "%100", label: "Müşteri memnuniyeti" },
  { value: "A'dan Z'ye", label: "Anahtar teslim proje" },
  { value: "Uşak", label: "Yerel güç, güvenilir iş" },
];

export function CorporateStats() {
  return (
    <section className="section">
      <div className="container-page grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5">
          <SectionHeading
            overline="Sitre Yapı"
            title="Az ve doğru iş, uzun vadeli güven."
            description="Sitre Yapı, az sayıda ama derinlemesine düşünülmüş projelerle ilerleyen bir yapı markasıdır. Hedefimiz, teslimden sonra da sahiplenebileceğimiz mekanlar üretmektir."
          />
          <Link href="/hakkimizda" className="btn btn-outline mt-10">
            Hakkımızda
          </Link>
        </div>
        <dl className="md:col-span-7 grid grid-cols-2 gap-px bg-[var(--color-border)] self-stretch">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-8 md:p-12">
              <dt className="eyebrow">{s.label}</dt>
              <dd
                className="display-lg mt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
