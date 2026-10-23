"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuickContact } from "@/components/forms/QuickContactProvider";

type Props = {
  overline: string;
  title: string;
  subtitle: string;
  primaryHref?: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  backgroundImage?: string;
  variant?: "home" | "project" | "page";
};

export function Hero({
  overline,
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  backgroundImage,
  variant = "home",
}: Props) {
  const { open } = useQuickContact();
  return (
    <section
      className="relative min-h-[92vh] flex items-end overflow-hidden dark-section"
      style={
        backgroundImage
          ? undefined
          : { background: "linear-gradient(180deg, #1c1711 0%, #0a0806 100%)" }
      }
      aria-label={title}
    >
      {backgroundImage && (
        <>
          {/**
           * Hero görseli CSS `background-image` ile verilirse Next'in görsel
           * işlem hattını tamamen atlar: ham JPEG gider, AVIF/WebP üretilmez
           * ve tarayıcının ön tarayıcısı onu geç keşfeder. Bu sayfalarda LCP
           * öğesi tam da bu görsel olduğu için `next/image` + `priority`
           * kullanılır — aynı görsel 257 KB yerine ~19 KB (AVIF) iniyor.
           */}
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
          {/* Metnin okunabilirliği için koyulaştırma; görselin üstünde durur. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,16,13,0.25) 0%, rgba(20,16,13,0.75) 100%)",
            }}
          />
        </>
      )}
      <div className="container-page relative z-10 pb-20 md:pb-28 pt-36">
        <p className="eyebrow !text-[var(--color-accent-soft)] mb-6">
          {overline}
        </p>
        <h1 className="display-xl max-w-5xl text-white">{title}</h1>
        <p className="lede mt-8 text-white/80 max-w-2xl">{subtitle}</p>
        <div className="mt-12 flex flex-wrap gap-4">
          {variant === "project" ? (
            <button
              type="button"
              onClick={() => open({ context: "proje-hero" })}
              className="btn btn-on-dark"
            >
              {primaryLabel}
            </button>
          ) : primaryHref ? (
            <Link href={primaryHref} className="btn btn-on-dark">
              {primaryLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => open({ context: "proje-hero" })}
              className="btn btn-on-dark"
            >
              {primaryLabel}
            </button>
          )}
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="btn btn-outline !text-white !border-white hover:!bg-white hover:!text-[var(--color-brand)]"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.18em] text-white/40">
        Aşağı kaydır
      </span>
    </section>
  );
}
