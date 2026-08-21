import type { Project } from "./types";
import { sitreUrlaKonaklari } from "./sitre-urla-konaklari";
import { sitreCesmeResidence } from "./sitre-cesme-residence";
import { sitreBornovaPark } from "./sitre-bornova-park";

export const projects: Project[] = [
  sitreUrlaKonaklari,
  sitreCesmeResidence,
  sitreBornovaPark,
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(count = 3): Project[] {
  return projects.slice(0, count);
}

export function getRelatedProjects(slug: string, count = 2): Project[] {
  return projects.filter((p) => p.slug !== slug).slice(0, count);
}

export type { Project } from "./types";
export { statusLabel } from "./types";
