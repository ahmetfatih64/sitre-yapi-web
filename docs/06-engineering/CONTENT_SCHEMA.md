# CONTENT_SCHEMA — İçerik tip tanımları

Bu dosya, repo-içi içerik dosyalarının **kesin TypeScript şeması**dır. Tüm içerik, `src/content/*` altındaki TS dosyalarında bu tipleri karşılamak zorundadır. Build-time Zod doğrulaması uygulanabilir; geçerli tip hatası build'i kırar.

---

## 1. `SiteConfig`

```ts
type SiteConfig = {
  name: string;                // "Sitre Yapı"
  tagline: string;             // kısa marka cümlesi
  description: string;         // 150-160 karakter SEO tabanı
  url: string;                 // https://sitreyapi.com
  locale: "tr" | "en";
  defaultOgImage: string;      // /og/default.jpg
  contact: {
    phone: string;
    phoneHref: string;         // tel:+90...
    email: string;
    whatsapp?: string;
    address: {
      street: string;
      city: string;
      postalCode?: string;
      country: string;
      lat: number;
      lng: number;
    };
    hours: { label: string; value: string }[];
  };
  social: { platform: "instagram" | "linkedin" | "youtube" | "facebook" | "x"; href: string }[];
  legal: {
    companyName: string;
    taxOffice?: string;
    taxNumber?: string;
    mersis?: string;
  };
};
```

---

## 2. `NavItem`

```ts
type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};
```

---

## 3. `Service`

```ts
type Service = {
  id: string;
  title: string;
  summary: string;            // 1-2 cümle
  body: string;               // paragraf
  icon?: string;              // optional icon key
};
```

---

## 4. `Project` (ana şablon)

```ts
type ProjectStatus = "active" | "completed" | "upcoming";

type Project = {
  slug: string;                        // "sitre-urla-konaklari"
  name: string;                        // "Sitre Urla Konakları"
  locationLabel: string;               // "İzmir — Urla"
  status: ProjectStatus;
  tags?: string[];                     // ["Konut", "Düşük yoğunluk"]
  shortSummary: string;                // kart için 1-2 cümle
  coverImage: { src: string; alt: string };
  meta: {
    title: string;
    description: string;
    ogImage?: string;
  };
  hero: {
    mediaType: "image" | "video";
    media: { src: string; alt: string; poster?: string };
    overline: string;
    title: string;
    subtitle: string;
    location: string;
    status: ProjectStatus;
    primaryCtaLabel: string;
    secondaryCtaLabel?: string;
  };
  concept: {
    overline: string;
    title: string;
    body: string[];             // paragraflar
    highlights: string[];       // 3 madde
    image: { src: string; alt: string };
  };
  location: {
    overline: string;
    title: string;
    address: string;
    coordinates: { lat: number; lng: number };
    body: string[];
    nearby: { name: string; category: "okul" | "saglik" | "alisveris" | "ulasim" | "sosyal" | "doga"; distance: string }[];
    mapEmbed?: string;
  };
  features: { label: string; value: string }[];
  gallery: {
    overline: string;
    title: string;
    categories: string[];
    items: { id: string; src: string; alt: string; category: string; caption?: string }[];
  };
  amenities: {
    overline: string;
    title: string;
    items: { name: string; description?: string; icon?: string }[];
    image?: { src: string; alt: string };
  };
  siteplan: {
    overline: string;
    title: string;
    image: { src: string; alt: string };
    hotspots?: { id: string; x: number; y: number; label: string }[];
  };
  plans: {
    overline: string;
    title: string;
    categories: string[];
    items: {
      category: string;
      code: string;
      image: { src: string; alt: string };
      totalArea: number;
      netArea: number;
      rooms: { name: string; area: number }[];
      orientation?: string;
      floorRange?: string;
    }[];
  };
  tour?: {
    available: boolean;
    embedUrl?: string;
    ctaLabel?: string;
  };
  bottomCta: {
    title: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel?: string;
    backgroundImage?: { src: string; alt: string };
  };
};
```

---

## 5. `LegalDocument`

```ts
type LegalDocument = {
  slug: "kvkk" | "cerez-politikasi";
  title: string;
  updatedAt: string;    // ISO date
  bodyHtml: string;     // markdown/html
};
```

---

## 6. Doğrulama

- Build-time: Zod schema; hatalı içerik build'i kırar.
- Görsel yolları `public/` altında aranır; bulunamazsa build kırılır.
- `features` 4–6 arası, `nearby` 5–10, `gallery.items` 8–40 (uyarı, kırmaz).
