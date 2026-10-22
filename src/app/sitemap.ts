import type { MetadataRoute } from "next";
import { listProjectSlugs } from "@/content/projects/service";
import { siteConfig } from "@/content/site.config";
import { env } from "@/lib/env";

/**
 * Proje adresleri içerik servisinden okunur, statik TS dizisinden değil:
 * sayfalar da (`generateStaticParams`) aynı kaynaktan üretiliyor. Statik
 * dizi kullanılırsa yönetim panelinden eklenen bir proje sitede görünür
 * ama sitemap'e hiç girmez.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  if (!env.IS_APP_PROD) {
    return [{ url: base, lastModified: now, changeFrequency: "monthly", priority: 1 }];
  }
  const staticRoutes = [
    "",
    "/hakkimizda",
    "/projeler",
    "/hizmetler",
    "/iletisim",
    "/kvkk",
    "/gizlilik",
    "/cerez-politikasi",
  ];
  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...(await listProjectSlugs()).map((slug) => ({
      url: `${base}/projeler/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
