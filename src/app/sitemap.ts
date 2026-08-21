import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/site.config";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
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
    ...projects.map((p) => ({
      url: `${base}/projeler/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
