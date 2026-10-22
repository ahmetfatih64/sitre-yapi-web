"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** "12+" veya "%100" gibi; içindeki ilk sayı animasyonla sayılır. */
  value: string;
};

const DURATION_MS = 1400;

/**
 * Metindeki sayıyı görüş alanına girince 0'dan hedefe sayar. Sayı içermeyen
 * değerler ("Uşak", "A'dan Z'ye") olduğu gibi basılır.
 * `prefers-reduced-motion` açıkken animasyon kurulmaz.
 */
export function CountUpValue({ value }: Props) {
  const match = value.match(/\d+/);
  const target = match ? Number(match[0]) : null;

  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<number | null>(target === null ? null : 0);

  useEffect(() => {
    if (target === null) return;
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION_MS);
            // easeOutCubic — sona doğru yavaşlar
            const eased = 1 - Math.pow(1 - t, 3);
            setShown(Math.round(target * eased));
            if (t < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  if (target === null || shown === null) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {value.replace(/\d+/, String(shown))}
    </span>
  );
}
