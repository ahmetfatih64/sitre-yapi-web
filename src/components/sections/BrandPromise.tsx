import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

/** Hakkımızda sayfasındaki değerlerin kısaltılmış hali. */
const principles = [
  {
    n: "01",
    title: "Özen",
    body: "Her kararın ardında bir fikir aramak; detayı süslemek değil, anlamlandırmak.",
  },
  {
    n: "02",
    title: "Şeffaflık",
    body: "Sözleşme, süreç ve teslim açık; sürprize yer yok.",
  },
  {
    n: "03",
    title: "Süreklilik",
    body: "Teslim sonrası devam eden bir ilişki. İşimizi sahiplenerek yürütürüz.",
  },
];

export function BrandPromise() {
  return (
    <section className="section dark-section grain relative overflow-hidden">
      <div className="container-page relative z-[2]">
        <Reveal>
          <p className="eyebrow mb-8">Marka vaadi</p>
          <h2 className="display-lg max-w-4xl text-white">
            Az sayıda ama derinlemesine{" "}
            <span className="text-[var(--color-accent)]">düşünülmüş</span>{" "}
            projeler.
          </h2>
        </Reveal>

        <div className="mt-14 lg:mt-20 grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <Reveal delay={100} className="lg:col-span-7">
            <figure className="relative aspect-[16/11] overflow-hidden">
              <Image
                src="/images/stock/brand-promise.jpg"
                alt="Modern mimari cephe detayı"
                fill
                className="object-cover"
                style={{ filter: "saturate(0.88) contrast(1.06)" }}
                sizes="(min-width: 1024px) 58vw, 100vw"
              />
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(13,10,8,0) 55%, rgba(13,10,8,0.5) 100%)",
                }}
              />
            </figure>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-5 lg:pt-6">
            <p className="text-lg leading-relaxed text-white/70">
              Sitre Yapı, tasarım odaklı ve süreç şeffaflığına önem veren bir
              yapı geliştiricisidir. Her proje, bulunduğu yerin mimari diliyle
              başlar; teslim sonrasına uzanan uzun vadeli bir ilişki ile devam
              eder.
            </p>

            <ul className="mt-12 flex flex-col">
              {principles.map((item) => (
                <li
                  key={item.n}
                  className="grid grid-cols-[auto_1fr] gap-6 py-6 border-t border-white/12 last:border-b"
                >
                  <span className="eyebrow pt-1 tabular-nums">{item.n}</span>
                  <div>
                    <h3
                      className="text-xl text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
