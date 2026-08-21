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
