"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * "Yerleşke ve yaşam" bölümü.
 *
 * İki klip: önce yerleşkenin bütünü (havadan), sonra içindeki yaşam (yer
 * seviyesi). Videolar yalnızca görüş alanına girince yüklenir ve oynar;
 * ekrandan çıkınca duraklar. Böylece anasayfa ilk yükte ağırlaşmaz.
 */

type Scene = {
  src: string;
  poster: string;
  overline: string;
  title: string;
  body: string;
  alt: string;
};

const SCENES: Scene[] = [
  {
    src: "/images/stock/yerleske.mp4",
    poster: "/images/stock/yerleske-poster.jpg",
    overline: "Yerleşke",
    title: "Yapı, yerin kendisiyle başlar.",
    body: "Kütleleri araziye yaymak, ağaçları korumak, gölgeyi ve rüzgârı hesaba katmak — yerleşim kararları bir projenin en kalıcı kısmıdır.",
    alt: "Ağaçlar arasına yayılmış konut yerleşkesinin havadan görünümü",
  },
  {
    src: "/images/stock/yasam.mp4",
    poster: "/images/stock/yasam-poster.jpg",
    overline: "Yaşam",
    title: "İyi bir yerleşke, yürümek isteten yerdir.",
    body: "Peyzaj süs değildir; günlük hayatın geçtiği zemindir. Yolların genişliği, gölge aralıkları ve manzara açıklıkları buna göre kurulur.",
    alt: "Ağaçlıklı bir yolda yürüyen kişi",
  },
];

export function LifeOnSite() {
  return (
    <section className="section dark-section grain relative overflow-hidden">
      <div className="container-page relative z-[2]">
        <p className="eyebrow mb-8">Yerinde yaşam</p>
        <h2 className="display-lg max-w-3xl text-white">
          Bir proje, <span className="text-[var(--color-accent)]">yerleşke</span>{" "}
          ve içinde geçen hayattır.
        </h2>

        <div className="scenes">
          {SCENES.map((scene, index) => (
            <SceneBlock key={scene.src} scene={scene} reversed={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SceneBlock({ scene, reversed }: { scene: Scene; reversed: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /**
   * `loaded` bir kez true olunca geri dönmez: bölüm ekrandan çıkınca video
   * boşaltılmasın, geri kaydırıldığında baştan inmesin.
   */
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
          if (entry.isIntersecting) setLoaded(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /**
   * Oynatma ayrı bir etkide: `src` React tarafından basıldıktan sonra
   * çalışmalı. Aynı tick içinde play() çağırmak kaynaksız videoda sessizce
   * başarısız oluyor ve yükleme hiç tetiklenmiyordu.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loaded) return;

    if (!inView) {
      video.pause();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => undefined);
  }, [loaded, inView]);

  return (
    <div ref={wrapRef} className={cn("scene", reversed && "scene--reversed")}>
      <figure className="scene__media">
        {/**
         * Poster `<video poster>` ile verilirse ham JPEG, ekranın altında
         * olmasına rağmen sayfa açılışında indirilir ve Next'in görsel
         * işlem hattını atlar. `next/image` hem tembel yükler hem AVIF
         * üretir; video görüş alanına girince üstünü kapatır.
         */}
        <Image
          src={scene.poster}
          alt=""
          fill
          loading="lazy"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          src={loaded ? scene.src : undefined}
          loop
          muted
          playsInline
          preload="none"
          aria-label={scene.alt}
          className="scene__video relative"
        />
      </figure>

      <div className="scene__text">
        <p className="eyebrow mb-4">{scene.overline}</p>
        <h3 className="scene__title">{scene.title}</h3>
        <p className="scene__body">{scene.body}</p>
      </div>
    </div>
  );
}
