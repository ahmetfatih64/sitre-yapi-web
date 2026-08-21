import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site.config";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const allowIndexing = env.IS_APP_PROD;
  return {
    rules: allowIndexing
      ? [
          { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
        ]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
