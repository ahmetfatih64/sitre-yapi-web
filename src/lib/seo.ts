import type { Metadata } from "next";
import { siteConfig } from "@/content/site.config";
import type { Project } from "@/content/projects";
import { env } from "@/lib/env";

type BuildMetadataArgs = {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex,
}: BuildMetadataArgs): Metadata {
  const allowIndex = env.IS_APP_PROD && !noindex;
  const desc = description ?? siteConfig.description;
  const url = `${siteConfig.url}${path}`;
  const fullTitle =
    path === "/"
      ? `${siteConfig.name} — ${siteConfig.tagline}`
      : `${title} | ${siteConfig.name}`;

  const ogImage = image ?? siteConfig.defaultOgImage;
  const ogImageField = {
    images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  };

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: siteConfig.name,
      locale: "tr_TR",
      type,
      ...ogImageField,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: allowIndex
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}

export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function placeJsonLd(p: {
  name: string;
  lat: number;
  lng: number;
  address: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: p.name,
    address: { "@type": "PostalAddress", streetAddress: p.address, addressCountry: "TR" },
    geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/ana_logo.jpeg`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: "customer service",
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
    sameAs: siteConfig.social.map((s) => s.href),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "tr-TR",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function breadcrumbJsonLd(
  crumbs: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteConfig.url}${c.path}`,
    })),
  };
}

export function realEstateListingJsonLd(project: Project) {
  const url = `${siteConfig.url}/projeler/${project.slug}`;
  const image = `${siteConfig.url}${project.coverImage.src}`;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: project.meta.description,
    url,
    image,
    datePosted: new Date().toISOString().slice(0, 10),
    address: {
      "@type": "PostalAddress",
      addressLocality: project.location.address,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: project.location.coordinates.lat,
      longitude: project.location.coordinates.lng,
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
