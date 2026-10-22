import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const baselineHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  /**
   * Build ciktisi dizini. `next build` ile `next dev` ayni dizini
   * paylasirsa, dev sunucusu calisirken alinan bir uretim build'i onun
   * chunk'larini siler ve dev sunucusu 500 vermeye baslar. `npm run
   * build:prod` bu degiskeni ayarlayarak ayri bir dizine yazar.
   */
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ["clsx"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: baselineHeaders,
      },
    ];
  },
};

export default nextConfig;
