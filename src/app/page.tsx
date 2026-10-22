import type { Metadata } from "next";
import Link from "next/link";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { BrandPromise } from "@/components/sections/BrandPromise";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { LifeOnSite } from "@/components/sections/LifeOnSite";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { CorporateStats } from "@/components/sections/CorporateStats";
import { CtaBand } from "@/components/sections/CtaBand";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ana Sayfa",
  path: "/",
  description:
    "Sitre Yapı — İyi inşa edilmiş, iyi düşünülmüş mekanlar. Konut ve karma kullanımlı projelerimizi keşfedin.",
});

export default function HomePage() {
  return (
    <>
      {/* GIF Hero */}
      <section
        className="relative md:h-screen flex flex-col md:block overflow-hidden"
        style={{ background: "var(--color-brand)" }}
      >
        <HeroVideo />
        {/* Gradient — sadece masaüstünde video üstünde; mobilde metin ayrı blokta */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,16,13,0.15) 0%, rgba(20,16,13,0.7) 70%, rgba(20,16,13,0.9) 100%)",
          }}
        />
        <div className="container-page relative z-10 pt-10 pb-14 md:pb-28 md:pt-36 md:absolute md:inset-x-0 md:bottom-0">
          <p className="eyebrow !text-[var(--color-accent)] mb-6">
            Sitre Yapı
          </p>
          <h1 className="display-xl max-w-5xl text-white">
            İyi inşa edilmiş,{" "}
            <span className="text-[var(--color-accent)]">iyi düşünülmüş</span>{" "}
            mekanlar.
          </h1>
          <p className="lede mt-8 text-white/80 max-w-2xl">
            Mimari özen ve uzun vadeli değer arayışıyla, az ve doğru projeler
            üretiyoruz.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/projeler"
              className="btn"
              style={{
                background: "#fff",
                color: "var(--color-brand)",
                borderColor: "#fff",
              }}
            >
              Projeleri keşfet
            </Link>
            <Link
              href="/hakkimizda"
              className="btn"
              style={{
                background: "transparent",
                color: "#fff",
                borderColor: "rgba(255,255,255,0.5)",
              }}
            >
              Hakkımızda
            </Link>
          </div>
        </div>
      </section>
      <BrandPromise />
      <FeaturedProjects />
      <LifeOnSite />
      <ServicesOverview />
      <CorporateStats />
      <CtaBand
        overline="İletişim"
        title="Yeni bir projeyi beraber düşünelim."
        description="Bir arsa, bir fikir ya da bir ihtiyaç — konuşmaya açığız. Kısa bir form yeterli."
        primaryLabel="Size ulaşalım"
        secondaryLabel="Tüm projeler"
        secondaryHref="/projeler"
      />
    </>
  );
}
