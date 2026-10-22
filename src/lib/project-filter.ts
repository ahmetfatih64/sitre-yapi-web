/**
 * Proje listesi süzgeci.
 *
 * Durum ve etiket seçimi URL'de tutulur; böylece filtrelenmiş bir liste
 * paylaşılabilir ve geri tuşu beklendiği gibi çalışır. Buradaki işlevler
 * saftır: React'ten bağımsız test edilir.
 */

import type { Project } from "@/content/projects";

export type StatusFilter = "all" | "active" | "upcoming" | "completed";

const STATUS_VALUES: StatusFilter[] = ["all", "active", "upcoming", "completed"];

export type ProjectFilterState = {
  status: StatusFilter;
  /** Seçili etiketler; boşsa etiket süzgeci uygulanmaz. */
  tags: string[];
};

export const EMPTY_FILTER: ProjectFilterState = { status: "all", tags: [] };

/** URL'de kullanılan parametre adları. */
export const PARAM = { status: "durum", tags: "etiket" } as const;

/** Projelerde geçen tüm etiketleri, görünme sırasını koruyarak toplar. */
export function collectTags(projects: readonly Project[]): string[] {
  const seen = new Set<string>();
  for (const project of projects) {
    for (const tag of project.tags) {
      const trimmed = tag.trim();
      if (trimmed) seen.add(trimmed);
    }
  }
  return [...seen];
}

function isStatusFilter(value: string): value is StatusFilter {
  return (STATUS_VALUES as string[]).includes(value);
}

/**
 * URL parametrelerini süzgeç durumuna çevirir. Tanınmayan değerler
 * yok sayılır; elle düzenlenmiş bir adres sayfayı bozmamalıdır.
 */
export function parseFilterState(
  params: URLSearchParams,
  availableTags: readonly string[] = []
): ProjectFilterState {
  const rawStatus = params.get(PARAM.status) ?? "";
  const status = isStatusFilter(rawStatus) ? rawStatus : "all";

  const rawTags = params.getAll(PARAM.tags).flatMap((v) => v.split(","));
  const allowed = new Set(availableTags);
  const tags = [...new Set(rawTags.map((t) => t.trim()).filter(Boolean))].filter(
    (t) => allowed.size === 0 || allowed.has(t)
  );

  return { status, tags };
}

/** Süzgeç durumunu URL sorgu dizesine çevirir; varsayılanlar yazılmaz. */
export function toQueryString(state: ProjectFilterState): string {
  const params = new URLSearchParams();
  if (state.status !== "all") params.set(PARAM.status, state.status);
  for (const tag of state.tags) params.append(PARAM.tags, tag);
  return params.toString();
}

/**
 * Durum VE etiket süzgecini uygular. Etiketler arasında "veya" geçerlidir:
 * seçili etiketlerden en az birini taşıyan proje listede kalır.
 */
export function filterProjects(
  projects: readonly Project[],
  state: ProjectFilterState
): Project[] {
  return projects.filter((project) => {
    if (state.status !== "all" && project.status !== state.status) return false;
    if (state.tags.length === 0) return true;
    return state.tags.some((tag) => project.tags.includes(tag));
  });
}

/** Bir etiketi seçime ekler ya da seçimden çıkarır. */
export function toggleTag(
  state: ProjectFilterState,
  tag: string
): ProjectFilterState {
  const tags = state.tags.includes(tag)
    ? state.tags.filter((t) => t !== tag)
    : [...state.tags, tag];
  return { ...state, tags };
}

export function isFilterActive(state: ProjectFilterState): boolean {
  return state.status !== "all" || state.tags.length > 0;
}
