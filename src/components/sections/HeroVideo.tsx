"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Anasayfa hero videosu.
 *
 * Süresiz döngüde oynayan bir hareket olduğu için WCAG 2.2.2 gereği
 * durdurulabilir olmalı. Ayrıca `prefers-reduced-motion` açıksa hiç
 * başlamaz; kullanıcı isterse kendisi başlatır.
 */
const POSTER = "/images/stock/anasayfa_poster.jpg";
const VIDEO_SRC = "/images/stock/anasayfa_hero.mp4";

/** Videonun altına inilmesi mantıklı olan en dar ekran. */
const EN_DAR_VIDEO_GENISLIGI = 768;

type AgBilgisi = { saveData?: boolean; effectiveType?: string };

/**
 * Hero videosu 3.1 MB'dır. Yavaş bağlantıda ya da dar ekranda indirmek
 * sayfayı saniyelerce bloke eder ve kullanıcıya hiçbir şey kazandırmaz —
 * poster zaten sahneyi gösteriyor.
 *
 * Bu yüzden video yalnızca şu koşullarda yüklenir:
 *  - kullanıcı hareket azaltma istemiyorsa (WCAG 2.2.2 ve tercih),
 *  - ekran video için yeterince genişse,
 *  - tarayıcı veri tasarrufu ya da yavaş bağlantı bildirmiyorsa.
 *
 * Koşullar tutmazsa poster kalır; kullanıcı isterse oynat düğmesiyle
 * kendisi başlatabilir.
 */
function videoYuklenmeli(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < EN_DAR_VIDEO_GENISLIGI) return false;

  const ag = (navigator as Navigator & { connection?: AgBilgisi }).connection;
  if (ag?.saveData) return false;
  if (ag?.effectiveType && /(^|-)2g$|^slow-2g$|^3g$/.test(ag.effectiveType)) {
    return false;
  }
  return true;
}

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Video koşullar elverirse yüklenir; o ana kadar oynamıyor sayılır.
  const [playing, setPlaying] = useState(false);
  /**
   * Sayfanın LCP öğesi bu videonun posteridir. `src` işaretlemede
   * verildiğinde ~886KB'lık video poster ile aynı anda inmeye başlıyor,
   * bant genişliğini paylaşıyor ve LCP'yi eşiğin üstüne taşıyordu.
   * Bu yüzden kaynak ilk boyamadan sonra bağlanır.
   */
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!videoYuklenmeli()) return;

    const baslat = () => setSrc(VIDEO_SRC);
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(baslat, { timeout: 2000 });
      return;
    }
    const t = window.setTimeout(baslat, 300);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      setPlaying(false);
      return;
    }
    // Tarayıcı otomatik oynatmayı reddederse durum doğru kalsın.
    video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [src]);

  const toggle = () => {
    // Koşullar nedeniyle hiç yüklenmediyse, kullanıcının isteği onu getirir.
    if (!src) {
      setSrc(VIDEO_SRC);
      setPlaying(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative w-full aspect-video md:absolute md:inset-0 md:aspect-auto md:h-full">
      {/**
       * Poster sayfanın LCP öğesidir. `<video poster>` özniteliği ham
       * dosyayı alır ve Next'in görsel işlem hattını atlar (250 KB JPEG).
       * Bunun yerine altta `next/image` katmanı durur: aynı kare AVIF
       * olarak ~20 KB iner. Video yüklendiğinde üstünü kapatır.
       */}
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="none"
        className="relative w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        className="hero-video-toggle touch-icon"
        aria-label={playing ? "Videoyu duraklat" : "Videoyu oynat"}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
