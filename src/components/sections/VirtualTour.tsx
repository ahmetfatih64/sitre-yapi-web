"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useConsent } from "@/lib/consent/provider";
import {
  loadPannellum,
  maxTextureSize,
  pickPanorama,
  type PannellumViewer,
} from "@/lib/pannellum";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type TourPanorama = {
  /** Eşdikdörtgen panorama, geniş sürüm (4096×2048). */
  wide: string;
  /** Dar ekran ve düşük doku sınırı için (2048×1024). */
  narrow: string;
  poster: string;
  posterAlt: string;
  /** Tur açıldığında bakılacak başlangıç açısı; kapak karesiyle eşleşmeli. */
  initialYaw?: number;
  credit?: string;
  /** Temsilî görselleştirme ise arayüzde açıkça belirtilir. */
  isConcept?: boolean;
};

type Status = "idle" | "loading" | "ready" | "error";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function PanoramaTour({ panorama }: { panorama: TourPanorama }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const stop = useCallback(() => {
    viewerRef.current?.destroy();
    viewerRef.current = null;
    setStatus("idle");
  }, []);

  // Sayfadan ayrılırken görüntüleyici yıkılmazsa WebGL bağlamı sızar.
  useEffect(() => () => viewerRef.current?.destroy(), []);

  const start = useCallback(async () => {
    if (!containerRef.current || viewerRef.current) return;
    setStatus("loading");

    let pannellum;
    try {
      pannellum = await loadPannellum();
    } catch {
      setStatus("error");
      return;
    }
    // Yükleme sırasında bileşen kaldırılmış olabilir.
    if (!containerRef.current) return;

    const source = pickPanorama({
      wide: panorama.wide,
      narrow: panorama.narrow,
      viewportWidth: window.innerWidth,
      maxTexture: maxTextureSize(),
    });

    try {
      const viewer = pannellum.viewer(containerRef.current, {
        type: "equirectangular",
        panorama: source,
        autoLoad: true,
        autoRotate: prefersReducedMotion() ? 0 : -1.5,
        yaw: panorama.initialYaw ?? 0,
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
        friction: 0.15,
      });
      viewer.on("load", () => setStatus("ready"));
      viewer.on("error", () => setStatus("error"));
      viewerRef.current = viewer;
    } catch {
      setStatus("error");
    }
  }, [panorama]);

  return (
    <div className="relative w-full aspect-[16/10] md:aspect-[16/9] bg-[var(--color-brand)] overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      {status !== "ready" && (
        <div className="absolute inset-0">
          <Image
            src={panorama.poster}
            alt={panorama.posterAlt}
            fill
            sizes="(min-width: 768px) 70vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            {status === "error" ? (
              <>
                <p className="text-white max-w-sm">
                  Sanal tur bu cihazda açılamadı. Tarayıcınız 3B içeriği
                  desteklemiyor olabilir.
                </p>
                <button type="button" onClick={start} className="btn btn-primary">
                  Tekrar dene
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={start}
                disabled={status === "loading"}
                className="btn btn-primary disabled:opacity-70"
              >
                {status === "loading" ? "Yükleniyor…" : "Sanal turu başlat"}
              </button>
            )}
            {status === "idle" && (
              <p className="text-xs text-white/80 max-w-sm">
                Sürükleyerek etrafınıza bakabilirsiniz.
              </p>
            )}
          </div>
        </div>
      )}

      {status === "ready" && (
        <button
          type="button"
          onClick={stop}
          // Pannellum kendi zoom/tam ekran kontrollerini sol üste koyar.
          className="absolute top-4 right-4 z-10 px-4 py-2 text-xs uppercase tracking-[0.14em] bg-white/90 hover:bg-white transition-colors"
        >
          Turu kapat
        </button>
      )}
    </div>
  );
}

function EmbeddedTour({ embedUrl, title }: { embedUrl: string; title: string }) {
  const { state } = useConsent();
  const [manuallyLoaded, setManuallyLoaded] = useState(false);
  const allowed = state.marketing || manuallyLoaded;

  return (
    <div className="relative w-full aspect-[16/10] md:aspect-[16/9] border border-[var(--color-border)] bg-[var(--color-bg-alt)] overflow-hidden">
      {allowed ? (
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-sm text-[var(--color-muted)] max-w-sm">
            Sanal tur başka bir servisten yüklenir ve o servise istek gönderir.
            Yüklemek için onayınız gerekiyor.
          </p>
          <button
            type="button"
            onClick={() => setManuallyLoaded(true)}
            className="btn btn-primary"
          >
            Turu yükle
          </button>
        </div>
      )}
    </div>
  );
}

export type VirtualTourProps = {
  overline?: string;
  title?: string;
  tour: {
    available: boolean;
    embedUrl?: string;
    panorama?: TourPanorama;
  };
};

/**
 * 360° sanal tur. Kendi sunucumuzdaki panorama varsa o kullanılır (üçüncü
 * taraf isteği yoktur, onay gerekmez). Yoksa harici gömme adresi onaya bağlı
 * olarak yüklenir.
 */
export function VirtualTour({
  overline = "Sanal tur",
  title = "İçeride dolaşın.",
  tour,
}: VirtualTourProps) {
  if (!tour.available) return null;
  if (!tour.panorama && !tour.embedUrl) return null;

  return (
    <section className="section" id="sanal-tur">
      <div className="container-page">
        <SectionHeading overline={overline} title={title} />
        <div className="mt-10">
          {tour.panorama ? (
            <PanoramaTour panorama={tour.panorama} />
          ) : (
            <EmbeddedTour embedUrl={tour.embedUrl as string} title={title} />
          )}
        </div>
        {tour.panorama && (
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            {tour.panorama.isConcept && "Temsilî görselleştirme. "}
            {tour.panorama.credit}
          </p>
        )}
      </div>
    </section>
  );
}
