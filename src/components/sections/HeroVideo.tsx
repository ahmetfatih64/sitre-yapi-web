"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anasayfa hero videosu.
 *
 * Süresiz döngüde oynayan bir hareket olduğu için WCAG 2.2.2 gereği
 * durdurulabilir olmalı. Ayrıca `prefers-reduced-motion` açıksa hiç
 * başlamaz; kullanıcı isterse kendisi başlatır.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      setPlaying(false);
      return;
    }
    // Tarayıcı otomatik oynatmayı reddederse durum doğru kalsın.
    video.play().catch(() => setPlaying(false));
  }, []);

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
      <video
        ref={videoRef}
        src="/images/stock/anasayfa_hero.mp4"
        poster="/images/stock/anasayfa_poster.jpg"
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        className="hero-video-toggle"
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
