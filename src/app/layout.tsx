import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBar } from "@/components/layout/CookieBar";
import { QuickContactProvider } from "@/components/forms/QuickContactProvider";
import { ConsentProvider } from "@/lib/consent/provider";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/json-ld";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body-loaded",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-loaded",
  display: "swap",
  weight: ["400", "500"],
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
