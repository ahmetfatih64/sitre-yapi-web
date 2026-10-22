import "server-only";

import { env } from "@/lib/env";
import { parseProject } from "./schema";
import type { Project } from "./types";
import {
  projects as staticProjects,
  getProjectBySlug as staticBySlug,
} from "./index";

/**
 * Proje içeriğinin tek okuma noktası.
 *
 * Veritabanı yapılandırılmışsa yayınlanmış projeksiyondan okur; aksi halde
 * depodaki TS içeriğine düşer. Bu geçiş dönemi için kasıtlı bir tasarım:
 *
 *  - Veritabanı sağlanmadan site çalışmaya devam eder.
 *  - Veritabanı boşken (tohumlama öncesi) yine TS içeriği görünür.
 *  - Sorgu hata verirse site çökmez, yedeğe düşer ve durumu loglar.
 *
 * Veritabanından gelen her kayıt sayfaya ulaşmadan Zod ile doğrulanır;
 * bozuk tek kayıt tüm listeyi düşürmez, yalnızca kendisi elenir.
 */

async function repo() {
  const mod = await import("@sitre/db/repos/project");
  return mod.projectRepo;
}

async function fromDb(): Promise<Project[] | null> {
  if (!env.HAS_DB) return null;
  try {
    const payloads = await (await repo()).listPublished();
    const parsed = payloads
      .map((p, i) => parseProject(p, `projeksiyon[${i}]`))
      .filter((p): p is Project => p !== null);
    // Boş sonuç "veritabanı henüz tohumlanmadı" demektir; yedeğe düşülür.
    return parsed.length > 0 ? parsed : null;
  } catch (error) {
    console.warn(
      "[content] veritabanından okunamadı, TS içeriğine düşülüyor:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  return (await fromDb()) ?? staticProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (env.HAS_DB) {
    try {
      const payload = await (await repo()).getPublishedBySlug(slug);
      if (payload) {
        const parsed = parseProject(payload, `projeksiyon:${slug}`);
        if (parsed) return parsed;
      }
    } catch (error) {
      console.warn(
        `[content] ${slug} veritabanından okunamadı:`,
        error instanceof Error ? error.message : error
      );
    }
  }
  return staticBySlug(slug);
}

export async function getFeaturedProjects(count = 3): Promise<Project[]> {
  return (await getAllProjects()).slice(0, count);
}

export async function getRelatedProjects(
  slug: string,
  count = 2
): Promise<Project[]> {
  return (await getAllProjects()).filter((p) => p.slug !== slug).slice(0, count);
}

/** generateStaticParams için. Veritabanı boşsa depodaki sluglar kullanılır. */
export async function listProjectSlugs(): Promise<string[]> {
  return (await getAllProjects()).map((p) => p.slug);
}
