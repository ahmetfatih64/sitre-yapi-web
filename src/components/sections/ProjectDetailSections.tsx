"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Project } from "@/content/projects";
import { statusLabel } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { EmbedMap } from "@/components/ui/EmbedMap";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { PlanExplorer } from "@/components/ui/FloorPlan";
import { PlanComparison } from "@/components/sections/PlanComparison";
import { PlanSheets } from "@/components/print/PlanSheets";
import { useQuickContact } from "@/components/forms/QuickContactProvider";
import { formatArea, deliveryLabel } from "@/lib/utils";

export function ProjectConcept({ project }: { project: Project }) {
  const c = project.concept;
  return (
    <section className="section" id="konsept">
      <div className="container-page grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6">
          <SectionHeading overline={c.overline} title={c.title} />
          <div className="mt-8 flex flex-col gap-5 text-[var(--color-brand-soft)]">
            {c.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ul className="mt-10 flex flex-col gap-3">
            {c.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm border-t border-[var(--color-border)] pt-3"
              >
                <span className="text-[var(--color-accent)]">—</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-6">
          <div className="relative aspect-[4/5] bg-[var(--color-border)]">
            <Image
              src={c.image.src}
              alt={c.image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProjectLocation({ project }: { project: Project }) {
  const l = project.location;
  return (
    <section
      className="section bg-[var(--color-bg-alt)]"
      id="lokasyon"
    >
      <div className="container-page grid md:grid-cols-12 gap-12">
        <div className="md:col-span-6">
          <SectionHeading overline={l.overline} title={l.title} />
          <div className="mt-8 flex flex-col gap-5 text-[var(--color-brand-soft)]">
            {l.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-8 text-sm text-[var(--color-brand-soft)]">
            {l.address}
          </p>
        </div>
        <div className="md:col-span-6">
          <div className="border border-[var(--color-border)] bg-white">
            <div className="p-6 border-b border-[var(--color-border)]">
              <p className="eyebrow">Yakındaki noktalar</p>
            </div>
            <ul>
              {l.nearby.map((n, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-4 p-5 border-b last:border-b-0 border-[var(--color-border)]"
                >
                  <div>
                    <p className="text-sm">{n.name}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)] mt-1">
                      {n.category}
                    </p>
                  </div>
                  <span className="text-sm tabular-nums text-[var(--color-accent-ink)]">
                    {n.distance}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:col-span-12 mt-4">
          <EmbedMap
            lat={l.coordinates.lat}
            lng={l.coordinates.lng}
            query={`${project.name}, ${l.address}`}
            label={`${project.name} — ${l.address}`}
          />
        </div>
      </div>
    </section>
  );
}

export function ProjectFeatureBand({ project }: { project: Project }) {
  return (
    <section className="py-20 bg-[var(--color-bg-dark)] text-white grain relative overflow-hidden">
      <div className="container-page relative z-[2]">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10">
          {project.features.map((f) => (
            <li
              key={f.label}
              className="bg-[var(--color-bg-dark)] p-6 md:p-8"
            >
              <p className="eyebrow !text-[var(--color-accent-soft)] mb-3">
                {f.label}
              </p>
              <p
                className="text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {f.value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ProjectGallery({ project }: { project: Project }) {
  const g = project.gallery;
  const [filter, setFilter] = useState<string>("Tümü");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const items =
    filter === "Tümü" ? g.items : g.items.filter((i) => i.category === filter);
  const categories = ["Tümü", ...g.categories];

  const close = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? i : (i + 1) % items.length
      ),
    [items.length]
  );
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? i : (i - 1 + items.length) % items.length
      ),
    [items.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    // aria-modal="true" olan bir diyalogda odak dışarı çıkmamalı; aksi halde
    // klavye kullanıcısı arkadaki küçük resimlere sekmeyle geçebiliyor.
    const focusablesIn = (root: HTMLElement) =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key === "ArrowRight") return next();
      if (e.key === "ArrowLeft") return prev();
      if (e.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;
      const items = focusablesIn(root);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      const current = document.activeElement as HTMLElement | null;

      if (!current || !root.contains(current)) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, close, next, prev]);

  const active = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section className="section" id="galeri">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <SectionHeading overline={g.overline} title={g.title} />
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={
                  "px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors " +
                  (filter === c
                    ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-brand)]")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className={
                "group relative overflow-hidden bg-[var(--color-border)] text-left cursor-zoom-in " +
                (idx % 5 === 0 ? "aspect-[4/5]" : "aspect-[4/3]")
              }
              aria-label={`${item.alt} — büyüt`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {item.caption && (
                <span className="absolute bottom-3 left-3 right-3 text-xs text-white bg-black/40 px-3 py-2 backdrop-blur-sm">
                  {item.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Galeri büyük görünüm"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-5 right-5 text-white text-sm uppercase tracking-[0.18em] hover:text-[var(--color-accent)]"
            aria-label="Kapat"
          >
            Kapat ✕
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-3xl w-12 h-12 flex items-center justify-center"
            aria-label="Önceki"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-3xl w-12 h-12 flex items-center justify-center"
            aria-label="Sonraki"
          >
            ›
          </button>
          <figure
            className="relative w-full max-w-6xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <figcaption className="absolute -bottom-10 left-0 right-0 text-center text-xs text-white/70 tracking-[0.14em] uppercase">
              {(lightboxIndex ?? 0) + 1} / {items.length} — {active.alt}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

export function ProjectAmenities({ project }: { project: Project }) {
  const a = project.amenities;
  return (
    <section className="section bg-[var(--color-bg-alt)]" id="olanaklar">
      <div className="container-page">
        <SectionHeading overline={a.overline} title={a.title} align="center" />
        <ul className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-px bg-[var(--color-border)]">
          {a.items.map((item) => (
            <li
              key={item.name}
              className="bg-[var(--color-bg-alt)] p-8 text-center flex flex-col items-center gap-3"
            >
              <span
                className="text-lg md:text-xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.name}
              </span>
              {item.description && (
                <p className="text-sm text-[var(--color-brand-soft)] max-w-xs">
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ProjectSitePlan({ project }: { project: Project }) {
  const s = project.siteplan;
  return (
    <section className="section" id="vaziyet">
      <div className="container-page">
        <SectionHeading overline={s.overline} title={s.title} align="center" />
        <div className="mt-12 relative aspect-[16/9] bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
          <Image
            src={s.image.src}
            alt={s.image.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export function ProjectPlans({ project }: { project: Project }) {
  const p = project.plans;
  const [active, setActive] = useState<string>(p.categories[0] ?? "");
  const [compare, setCompare] = useState(false);
  const items = p.items.filter((i) => i.category === active);
  const canCompare = p.items.length > 1;
  const { open } = useQuickContact();
  return (
    <section className="section bg-[var(--color-bg-alt)]" id="planlar">
      <div className="container-page">
        <SectionHeading overline={p.overline} title={p.title} />
        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-4"
          data-print="hide"
        >
          <div className="flex gap-2 flex-wrap">
            {p.categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setActive(c);
                  setCompare(false);
                }}
                aria-pressed={!compare && active === c}
                className={
                  "px-5 py-3 text-xs uppercase tracking-[0.14em] border transition-colors " +
                  (!compare && active === c
                    ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-brand)]")
                }
              >
                {c}
              </button>
            ))}
          </div>
          {canCompare && (
            <button
              type="button"
              onClick={() => setCompare((v) => !v)}
              aria-pressed={compare}
              className={
                "px-5 py-3 text-xs uppercase tracking-[0.14em] border transition-colors " +
                (compare
                  ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-brand)]")
              }
            >
              {compare ? "Tek plan görünümü" : "Planları karşılaştır"}
            </button>
          )}
        </div>
        {compare && (
          <div
            className="mt-12 bg-white p-6 md:p-10 border border-[var(--color-border)]"
            data-print="hide"
          >
            <PlanComparison project={project} />
          </div>
        )}
        <div
          className={compare ? "hidden" : "mt-12 grid gap-10"}
          data-print="hide"
        >
          {items.map((it) => (
            <article
              key={it.code}
              className="grid md:grid-cols-12 gap-10 bg-white p-6 md:p-10 border border-[var(--color-border)]"
            >
              <div className="md:col-span-6">
                <PlanExplorer
                  rooms={it.rooms}
                  orientation={it.orientation}
                  image={it.image}
                />
              </div>
              <div className="md:col-span-6 flex flex-col">
                <p className="eyebrow">{it.category}</p>
                <h3
                  className="display-md mt-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {it.code}
                </h3>
                <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
                  <dt className="text-[var(--color-muted)]">Toplam</dt>
                  <dd className="tabular-nums text-right">
                    {formatArea(it.totalArea)}
                  </dd>
                  <dt className="text-[var(--color-muted)]">Net</dt>
                  <dd className="tabular-nums text-right">
                    {formatArea(it.netArea)}
                  </dd>
                  {it.orientation && (
                    <>
                      <dt className="text-[var(--color-muted)]">Cephe</dt>
                      <dd className="text-right">{it.orientation}</dd>
                    </>
                  )}
                  {it.floorRange && (
                    <>
                      <dt className="text-[var(--color-muted)]">Kat</dt>
                      <dd className="text-right">{it.floorRange}</dd>
                    </>
                  )}
                </dl>
                <div className="flex flex-wrap gap-3 self-start mt-8">
                  <button
                    type="button"
                    onClick={() =>
                      open({
                        project: project.slug,
                        plan: it.code,
                        context: "kat-plani",
                      })
                    }
                    className="btn btn-primary"
                  >
                    Bu plan için bilgi al
                  </button>
                  <WhatsAppCta
                    contextLabel={`${project.name} — ${it.code} (${it.category})`}
                    className="btn btn-outline"
                  >
                    WhatsApp&apos;tan sor
                  </WhatsAppCta>
                </div>
              </div>
            </article>
          ))}
        </div>
        <PlanSheets project={project} />
      </div>
    </section>
  );
}

export function RelatedProjects({
  projects: related,
}: {
  projects: Project[];
}) {
  if (!related.length) return null;
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading overline="Diğer" title="Diğer projelerimiz." />
          <Link href="/projeler" className="btn btn-ghost underline">
            Tümünü gör →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 110}>
              <RelatedCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedCard({ project }: { project: Project }) {
  const delivery = deliveryLabel(
    project.features.find((f) => f.label === "Teslim")?.value
  );
  return (
    <Link
      href={`/projeler/${project.slug}`}
      className="slide-card slide-card--wide group"
      aria-label={`${project.name} — ${project.locationLabel}`}
    >
      <div className="slide-card__media">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="slide-card__veil" aria-hidden />
        <span className="slide-card__status">{statusLabel[project.status]}</span>

        <div className="slide-card__body">
          <p className="eyebrow mb-3">
            {project.locationLabel}
            {delivery ? (
              <>
                <span className="slide-card__dot" aria-hidden>
                  ·
                </span>
                <span className="text-white/55">{delivery}</span>
              </>
            ) : null}
          </p>
          <h3
            className="text-[1.6rem] leading-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.name}
          </h3>
          <span className="slide-card__reveal">
            <span className="slide-card__summary">{project.shortSummary}</span>
            <span className="slide-card__rule" aria-hidden />
            <span className="slide-card__cta">
              Detayları incele
              <span aria-hidden>→</span>
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
