import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hakkımızda",
  path: "/hakkimizda",
  description:
    "Sitre Yapı'nın kurum hikayesi, mimari yaklaşımı, değerleri ve süreci.",
});

const values = [
  {
    title: "Özen",
    body: "Her kararın ardında bir fikir aramak; detayı süslemek değil, anlamlandırmak.",
  },
  {
    title: "Süreklilik",
    body: "Teslim sonrası devam eden bir ilişki. İşimizi, emaneten değil sahiplenerek yürütürüz.",
  },
  {
    title: "Şeffaflık",
    body: "Sözleşme, süreç ve teslim açık; sürprize yer yok.",
  },
  {
    title: "Mimari saygı",
    body: "Bir proje, bulunduğu yere saygı duyduğu kadar iyidir.",
  },
  {
    title: "Sadelik",
    body: "Eklemek kolaydır; asıl zor olan, eksiltmektir.",
  },
];

const steps = [
  {
    n: "01",
    title: "Fikir",
    body: "Arsanın ve bağlamın dilini dinleyerek mimari bir fikir kurarız.",
  },
  {
    n: "02",
    title: "Tasarım",
    body: "Kütle, peyzaj ve iç mekanı bir bütün olarak çözümleriz.",
  },
  {
    n: "03",
    title: "İnşaat",
    body: "Şantiyeyi kendi ekibimizle yönetir; kaliteyi taahhüt altına alırız.",
  },
  {
    n: "04",
    title: "Teslim",
    body: "Teslim bir son değil, başlangıç. Kayıt ve evraklar açık.",
  },
  {
    n: "05",
    title: "Sonrası",
    body: "Teslim sonrası iletişim ve bakım desteğiyle ilişkiyi sürdürürüz.",
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      <section className="section pt-40">
        <div className="container-page grid md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <SectionHeading
              overline="Sitre Yapı"
              title="Mimari özen ve uzun vadeli değer."
              description="Sitre Yapı, az sayıda ama derinlemesine düşünülmüş projeler üreten bir yapı markasıdır. İşimizi mimari disiplin, süreç şeffaflığı ve teslim kalitesi üzerine kurarız."
              as="h1"
              size="xl"
            />
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <p className="eyebrow mb-6">Hikaye</p>
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/stock/story.jpg"
                  alt="Sitre Yapı ekibi şantiyede"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>
            </div>
            <div className="md:col-span-7 flex flex-col gap-6 text-[var(--color-brand-soft)]">
              <p>
                Sitre Yapı'yı, klasik müteahhitlik pratiğinin dışında, tasarımın
                ve sürecin eşit derecede önemli olduğu bir zemin üzerine kurduk.
                Her projeye, arsanın dilini ve yaşam bağlamını anlamaya zaman
                ayırarak başlarız.
              </p>
              <p>
                İnşaat süreci, mimari fikrin ödün görmeden kurulabilmesi için
                kendi ekibimizle yönetilir. Teslim sonrası iletişim ve bakım
                desteğiyle ilişkimizi sürdürürüz — bu bize hem öğrenme hem de
                hesap verebilirlik alanı açar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[var(--color-bg-alt)]">
        <div className="container-page">
          <SectionHeading overline="Değerlerimiz" title="Neye inanıyoruz?" />
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-border)]">
            {values.map((v, i) => (
              <article key={v.title} className="bg-[var(--color-bg-alt)] p-8 md:p-10">
                <p className="eyebrow">0{i + 1}</p>
                <h3
                  className="text-2xl mt-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {v.title}
                </h3>
                <p className="mt-4 text-[var(--color-brand-soft)] text-sm leading-relaxed">
                  {v.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading overline="Süreç" title="Nasıl çalışıyoruz?" />
          <ol className="mt-16 grid md:grid-cols-5 gap-px bg-[var(--color-border)]">
            {steps.map((s) => (
              <li key={s.n} className="bg-white p-8">
                <p className="eyebrow !text-[var(--color-accent)]">{s.n}</p>
                <h3
                  className="text-xl mt-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-brand-soft)]">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        overline="Birlikte çalışalım"
        title="Bir projeyi beraber düşünmek ister misiniz?"
        description="Arsa, fikir, ortaklık ya da özel bir talep — konuşmaya açığız."
        primaryLabel="İletişime geç"
        secondaryLabel="Projelerimiz"
        secondaryHref="/projeler"
      />
    </>
  );
}
