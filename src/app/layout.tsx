import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBar } from "@/components/layout/CookieBar";
import { QuickContactProvider } from "@/components/forms/QuickContactProvider";
import { ConsentProvider } from "@/lib/consent/provider";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/json-ld";

/**
 * Fontlar depodan servis edilir; `next/font/google` kullanılmaz.
 *
 * Google sürümü fontları DERLEME ANINDA indiriyordu, yani derleme
 * fonts.googleapis.com'un erişilebilir olmasına bağımlıydı ve erişilemediği
 * bir anda nedenini belli etmeyen bir hatayla düşüyordu. Ayrıntı ve
 * dosyaların nasıl üretildiği: `src/app/fonts/README.md`.
 *
 * `fallback` değerleri globals.css'teki yığınla aynı tutulur: next/font
 * yedek yazı tipinin ölçülerine göre `size-adjust` hesaplar ve font
 * yüklenirken oluşan yerinden oynamayı (CLS) azaltır.
 */
const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-body-loaded",
  display: "swap",
  weight: "100 900",
  fallback: ["Helvetica Neue", "system-ui", "sans-serif"],
});

const fraunces = localFont({
  src: "./fonts/fraunces-latin.woff2",
  variable: "--font-display-loaded",
  display: "swap",
  weight: "100 900",
  fallback: ["Playfair Display", "Georgia", "serif"],
});

export const metadata: Metadata = buildMetadata({
  title: "Ana Sayfa",
  path: "/",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          İçeriğe atla
        </a>
        <ConsentProvider>
          <QuickContactProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <CookieBar />
          </QuickContactProvider>
        </ConsentProvider>
        <Script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd()) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd()) }}
        />
      </body>
    </html>
  );
}
