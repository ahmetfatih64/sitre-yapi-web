"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import { deliveryLabel } from "@/lib/utils";
import { statusLabel } from "@/content/projects";

type Props = {
  projects: Project[];
};

/** Kart künyesi için teslim bilgisi; tanımlı değilse alan hiç basılmaz. */
function deliveryOf(project: Project): string | undefined {
  return deliveryLabel(project.features.find((f) => f.label === "Teslim")?.value);
}

/**
 * Yatay proje rayı. Kaydırma yerel `scroll-snap` ile yapılır; ok tuşları ve
 * düğmeler yalnızca konumu sürükler. Böylece ek bir carousel bağımlılığı
 * olmadan dokunmatikte de doğal davranış korunur.
 */
export function ProjectSlider({ projects }: Props) {
  const railRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const total = projects.length;

  /**
   * Bir kartın yakalanma konumu. `scroll-padding-inline` kadar sola kaydırılır;
   * aksi halde hesaplanan hedef her zaman bir dolgu payı şaşar.
   */
  const snapOffset = (rail: HTMLElement, item: HTMLElement): number => {
    const pad = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
    return item.offsetLeft - rail.offsetLeft - pad;
  };

  // Kaydırma konumundan aktif kartı türet — ayrı bir state kaynağı tutmayız.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;
    const update = () => {
      const items = Array.from(rail.children) as HTMLElement[];
      if (items.length === 0) return;

      const max = rail.scrollWidth - rail.clientWidth;
      const x = rail.scrollLeft;

      setScrollable(max > 4);
      setAtStart(x <= 2);
      setAtEnd(x >= max - 2);

      // Son kart hiçbir zaman başa yakalanamaz (ray kalan mesafeden kısadır),
      // bu yüzden ray sonundayken doğrudan son kartı aktif sayarız.
      if (x >= max - 2) {
        setActive(items.length - 1);
        return;
      }

      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      items.forEach((item, index) => {
        const distance = Math.abs(snapOffset(rail, item) - x);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });
      setActive(nearest);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = useCallback((index: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const items = Array.from(rail.children) as HTMLElement[];
    const target = items[Math.max(0, Math.min(index, items.length - 1))];
    if (!target) return;
    rail.scrollTo({
      left: snapOffset(rail, target),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  };

  const progress = total > 1 ? ((active + 1) / total) * 100 : 100;

  return (
    <div
      role="group"
      aria-roledescription="galeri"
      aria-label="Seçili projeler"
      className="relative"
    >
      <ul
        ref={railRef}
        className="rail"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={`${total} projeden oluşan liste — sağ ve sol ok tuşlarıyla gezinin`}
      >
        {projects.map((project, index) => (
          <li
            key={project.slug}
            className="rail__item"
            aria-label={`${index + 1} / ${total}`}
          >
            <Link
              href={`/projeler/${project.slug}`}
              className="slide-card group"
              aria-label={`${project.name} — ${project.locationLabel}`}
            >
              <div className="slide-card__media">
                <Image
                  src={project.coverImage.src}
                  alt={project.coverImage.alt}
                  fill
                  sizes="(min-width: 1280px) 32vw, (min-width: 768px) 46vw, 82vw"
                  className="object-cover"
                />
                <span className="slide-card__veil" aria-hidden />
                <span className="slide-card__index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="slide-card__status">
                  {statusLabel[project.status]}
                </span>

                <div className="slide-card__body">
                  <p className="eyebrow mb-3">
                    {project.locationLabel}
                    {deliveryOf(project) ? (
                      <>
                        <span className="slide-card__dot" aria-hidden>
                          ·
                        </span>
                        <span className="text-white/55">
                          {deliveryOf(project)}
                        </span>
                      </>
                    ) : null}
                  </p>
                  <h3
                    className="text-[1.75rem] md:text-[2rem] leading-tight text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {project.name}
                  </h3>
                  <span className="slide-card__reveal">
                    <span className="slide-card__summary">
                      {project.shortSummary}
                    </span>
                    <span className="slide-card__rule" aria-hidden />
                    <span className="slide-card__cta">
                      Detayları incele
                      <span aria-hidden>→</span>
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div
        className="container-page mt-10 flex items-center justify-between gap-8"
        hidden={!scrollable}
      >
        <div className="flex items-center gap-5 flex-1 max-w-xs">
          <span
            className="text-xs tracking-[0.2em] tabular-nums text-white/60"
            aria-live="polite"
          >
            {String(active + 1).padStart(2, "0")}
            <span className="mx-2 text-white/25">—</span>
            {String(total).padStart(2, "0")}
          </span>
          <span className="rail-progress flex-1" aria-hidden>
            <span
              className="rail-progress__bar"
              style={{ width: `${progress}%` }}
            />
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rail-btn"
            onClick={() => goTo(active - 1)}
            disabled={atStart}
            aria-label="Önceki proje"
          >
            <Arrow direction="left" />
          </button>
          <button
            type="button"
            className="rail-btn"
            onClick={() => goTo(active + 1)}
            disabled={atEnd}
            aria-label="Sonraki proje"
          >
            <Arrow direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
