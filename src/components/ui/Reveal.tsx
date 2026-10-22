"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Ardışık öğeleri kademeli açmak için gecikme (ms). */
  delay?: number;
  className?: string;
  /** Liste içinde kullanılırken "li" verin; aksi halde geçersiz HTML üretilir. */
  as?: "div" | "li";
};

/**
 * Görüş alanına girince içeriği bir kez sahneye alır.
 * `prefers-reduced-motion` açıksa animasyon hiç kurulmaz, içerik anında görünür.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };
  const shared = {
    className: cn("reveal", shown && "reveal--in", className),
    style: delay ? { transitionDelay: `${delay}ms` } : undefined,
  };

  if (as === "li") {
    return (
      <li ref={setRef} {...shared}>
        {children}
      </li>
    );
  }
  return (
    <div ref={setRef} {...shared}>
      {children}
    </div>
  );
}
