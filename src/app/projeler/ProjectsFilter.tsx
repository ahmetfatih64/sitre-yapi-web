"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Project } from "@/content/projects";
import { statusLabel } from "@/content/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import {
  collectTags,
  filterProjects,
  isFilterActive,
  parseFilterState,
  toQueryString,
  toggleTag,
  EMPTY_FILTER,
  type ProjectFilterState,
  type StatusFilter,
} from "@/lib/project-filter";

const STATUS_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "active", label: statusLabel.active },
  { key: "upcoming", label: statusLabel.upcoming },
  { key: "completed", label: statusLabel.completed },
];

const chipClass = (selected: boolean) =>
  "px-5 py-3 text-xs uppercase tracking-[0.14em] border transition-colors " +
  (selected
    ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
    : "border-[var(--color-border)] hover:border-[var(--color-brand)]");

export function ProjectsFilter({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tags = useMemo(() => collectTags(projects), [projects]);
  const query = searchParams.toString();

  /**
   * Süzgeç hem yerel durumda hem URL'de tutulur.
   *
   * Yalnızca URL'de tutulsaydı, `router.replace` eşzamansız olduğu için
   * arka arkaya yapılan iki seçimden ilki kaybolurdu: ikinci tıklama henüz
   * güncellenmemiş adresi okuyup üzerine yazardı. Yerel durum anında
   * güncellenir, adres onu izler.
   */
  const [state, setState] = useState<ProjectFilterState>(() =>
    parseFilterState(new URLSearchParams(query), tags)
  );

  // Adres dışarıdan değişirse (geri/ileri tuşu, paylaşılan bağlantı) yansıt.
  useEffect(() => {
    setState((current) => {
      const fromUrl = parseFilterState(new URLSearchParams(query), tags);
      return toQueryString(current) === toQueryString(fromUrl) ? current : fromUrl;
    });
  }, [query, tags]);

  const visible = useMemo(() => filterProjects(projects, state), [projects, state]);

  /** Filtrelenmiş liste paylaşılabilsin diye seçim adrese de yazılır. */
  const apply = useCallback(
    (next: ProjectFilterState) => {
      setState(next);
      const nextQuery = toQueryString(next);
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router]
  );

  return (
    <section className="pb-32">
      <div className="container-page">
        <div className="mb-12 border-b border-[var(--color-border)] pb-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Proje aşaması">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => apply({ ...state, status: option.key })}
                aria-pressed={state.status === option.key}
                className={chipClass(state.status === option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-1">Etiketler</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Etiketler">
                {tags.map((tag) => {
                  const selected = state.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => apply(toggleTag(state, tag))}
                      aria-pressed={selected}
                      className={
                        "px-4 py-2 text-xs tracking-[0.08em] border transition-colors " +
                        (selected
                          ? "bg-[var(--color-accent)] text-[var(--color-brand)] border-[var(--color-accent)]"
                          : "border-[var(--color-border)] text-[var(--color-brand-soft)] hover:border-[var(--color-brand)]")
                      }
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              {isFilterActive(state) && (
                <button
                  type="button"
                  onClick={() => apply(EMPTY_FILTER)}
                  className="ml-1 text-xs underline underline-offset-4 text-[var(--color-muted)] hover:text-[var(--color-brand)] transition-colors"
                >
                  Süzgeci temizle
                </button>
              )}
            </div>
          )}
        </div>

        <p className="sr-only" aria-live="polite">
          {`${visible.length} proje listeleniyor`}
        </p>

        {visible.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__title">
              Bu filtre için şu an uygun proje bulunmuyor.
            </p>
            <p className="empty-state__note">
              Diğer aşamalardaki projelerimize göz atabilir ya da yeni
              projelerden haberdar olmak için bize yazabilirsiniz.
            </p>
            <button
              type="button"
              onClick={() => apply(EMPTY_FILTER)}
              className="btn btn-outline mt-6"
            >
              Tüm projeleri göster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
