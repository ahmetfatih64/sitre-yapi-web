"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav } from "@/content/navigation";
import { siteConfig } from "@/content/site.config";
import { useQuickContact } from "@/components/forms/QuickContactProvider";
import { ContactMenu } from "@/components/ui/ContactMenu";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open } = useQuickContact();
  const pathname = usePathname();

  // Anasayfa ve proje detayı koyu hero ile açılır. Header bunların üstünde
  // şeffafken açık renk metne geçmeli; diğer sayfaların üstü açık zeminli
  // olduğu için koyu metin doğru kalır.
  const hasDarkHero =
    pathname === "/" || (pathname?.startsWith("/projeler/") ?? false);
  const onDark = hasDarkHero && !scrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
    <header
      data-print="hide"
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-[background,border,color] duration-300",
        scrolled || mobileOpen
          ? "bg-white/95 backdrop-blur border-b border-[var(--color-border)]"
          : onDark
            ? "bg-gradient-to-b from-black/55 via-black/25 to-transparent text-white"
            : "bg-transparent"
      )}
    >
      <div className="container-page flex items-center justify-between py-4 md:py-5">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${siteConfig.name} ana sayfa`}
        >
          <Image
            src="/brand/ana_logo.jpeg"
            alt="Sitre Yapı logo"
            width={48}
            height={48}
            className="rounded-full object-cover"
            priority
          />
          <div className="flex flex-col">
            <span
              className="text-xl tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sitre <span className="text-[var(--color-accent)]">Yapı</span>
            </span>
            <span
              className={cn(
                // Dar ekranda iki satıra kırılıp görselin üstüne taşıyordu;
                // aynı ibare zaten logo görselinin içinde yer alıyor.
                "hidden sm:block text-[10px] uppercase tracking-[0.16em] leading-none mt-0.5 whitespace-nowrap",
                onDark ? "text-white/75" : "text-[var(--color-muted)]"
              )}
            >
              Mimarlık - Mühendislik
            </span>
          </div>
        </Link>

        <nav aria-label="Birincil" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[13px] uppercase tracking-[0.14em] hover:text-[var(--color-accent)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ContactMenu mode="phone" onDark={onDark} />
          <ContactMenu mode="whatsapp" onDark={onDark} />
          <button
            type="button"
            onClick={() => open({ context: "header" })}
            className={cn("btn", onDark ? "btn-on-dark" : "btn-primary")}
          >
            Size Ulaşalım
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <ContactMenu mode="phone" onDark={onDark} />
          <ContactMenu mode="whatsapp" onDark={onDark} />
        <button
          type="button"
          aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex flex-col gap-[5px] w-11 h-11 items-center justify-center"
        >
          <span
            className={cn(
              "block w-6 h-[2px] bg-current transition-transform",
              mobileOpen && "translate-y-[7px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block w-6 h-[2px] bg-current transition-opacity",
              mobileOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block w-6 h-[2px] bg-current transition-transform",
              mobileOpen && "-translate-y-[7px] -rotate-45"
            )}
          />
        </button>
        </div>
      </div>

      </header>

      {/* Backdrop */}
      <div
        className="lg:hidden"
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20,16,13,0.5)",
          backdropFilter: "blur(2px)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 300ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          zIndex: 44,
        }}
      />

      {/* Drawer */}
      <aside
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Mobil menü"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        className="lg:hidden"
        style={{
          position: "fixed",
          top: "14px",
          right: "14px",
          bottom: "14px",
          width: "min(86vw, 380px)",
          background:
            "linear-gradient(160deg, #ffffff 0%, #fbf9f6 60%, #f4efe7 100%)",
          borderRadius: "28px",
          boxShadow:
            "0 40px 80px -24px rgba(20,16,13,0.45), 0 10px 24px -8px rgba(20,16,13,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
          transform: mobileOpen
            ? "translateX(0) scale(1)"
            : "translateX(calc(100% + 20px)) scale(0.98)",
          transformOrigin: "right center",
          transition:
            "transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms ease",
          opacity: mobileOpen ? 1 : 0,
          zIndex: 46,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Abstract decorative blobs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-80px",
            right: "-60px",
            width: "220px",
            height: "220px",
            background:
              "radial-gradient(circle, rgba(212,168,67,0.35) 0%, rgba(212,168,67,0) 65%)",
            filter: "blur(6px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-70px",
            left: "-50px",
            width: "240px",
            height: "240px",
            background:
              "radial-gradient(circle, rgba(43,42,40,0.18) 0%, rgba(43,42,40,0) 70%)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "40%",
            left: "-80px",
            width: "160px",
            height: "160px",
            background:
              "radial-gradient(circle, rgba(232,201,106,0.22) 0%, rgba(232,201,106,0) 70%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />

        <div
          className="relative flex items-center justify-between px-7 py-5"
          style={{ borderBottom: "1px solid rgba(230,226,221,0.6)" }}
        >
          <div className="flex flex-col">
            <span className="eyebrow">Sitre Yapı</span>
            <span
              className="text-lg mt-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Menü
            </span>
          </div>
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setMobileOpen(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "rgba(43,42,40,0.06)",
              color: "var(--color-brand)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav
          aria-label="Mobil birincil"
          className="relative flex-1 px-7 py-8 overflow-y-auto"
        >
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item, i) => (
              <li
                key={item.href}
                style={{
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateX(0)" : "translateX(24px)",
                  transition: `opacity 420ms ${150 + i * 70}ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 420ms ${150 + i * 70}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-center justify-between py-4 px-4 rounded-2xl hover:bg-white/70 transition-colors"
                >
                  <span
                    className="text-2xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all group-hover:bg-[var(--color-accent)] group-hover:text-white"
                    style={{
                      background: "rgba(43,42,40,0.05)",
                      color: "var(--color-brand-soft)",
                    }}
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="relative px-7 pb-7 pt-5 flex flex-col gap-4"
          style={{ borderTop: "1px solid rgba(230,226,221,0.6)" }}
        >
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-xs tracking-[0.16em] uppercase text-[var(--color-brand-soft)] hover:text-[var(--color-accent)]"
          >
            {siteConfig.contact.email}
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              open({ context: "mobil-menu" });
            }}
            className="btn btn-primary"
            style={{ borderRadius: "999px" }}
          >
            Size Ulaşalım
          </button>
        </div>
      </aside>
    </>
  );
}
