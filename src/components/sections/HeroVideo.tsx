"use client";

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

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  /**
   * Sayfanın LCP öğesi bu videonun posteridir. `src` işaretlemede
   * verildiğinde ~886KB'lık video poster ile aynı anda inmeye başlıyor,
   * bant genişliğini paylaşıyor ve LCP'yi eşiğin üstüne taşıyordu.
   * Bu yüzden kaynak ilk boyamadan sonra bağlanır.
   */
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
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
    video.play().catch(() => setPlaying(false));
  }, [src]);

  const toggle = () => {
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
      {/* Poster LCP öğesi; tarayıcı onu en yüksek öncelikle indirsin. */}
      <link rel="preload" as="image" href={POSTER} fetchPriority="high" />
      <video
        ref={videoRef}
        src={src}
        poster={POSTER}
        loop
        muted
        playsInline
        preload="none"
        className="w-full h-full object-cover"
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
