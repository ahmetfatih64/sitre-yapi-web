# METADATA_AND_SCHEMA — SEO meta ve JSON-LD

## 1. Metadata API şablonu
Her route, `generateMetadata` veya static `metadata` export'u ile:

```ts
export const metadata: Metadata = {
  title: "Sayfa başlığı | Sitre Yapı",
  description: "150-160 karakter, davet dilinde.",
  alternates: { canonical: "/route" },
  openGraph: { title, description, url, images: [{ url: ogImage, width: 1200, height: 630 }], locale: "tr_TR", type: "website", siteName: "Sitre Yapı" },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};
```

## 2. Title şablonu
- Ana sayfa: `Sitre Yapı — İyi inşa edilmiş, iyi düşünülmüş mekanlar`
- Diğer: `{{pageTitle}} | Sitre Yapı`
- Proje: `{{projectName}} — {{location}} | Sitre Yapı`

## 3. JSON-LD
- **Organization**: tüm sayfalarda (layout içinde).
- **BreadcrumbList**: iç sayfalarda.
- **RealEstateListing** (veya `Residence`): proje detay sayfalarında.
- **WebSite** + `SearchAction`: ana sayfada (arama yoksa atla).

## 4. Canonical kuralı
Her sayfa kendi URL'sini canonical gösterir. Query ve fragment dahil değildir.

## 5. OG image
Her sayfa için 1200×630. Eğer özel yoksa `site.config.defaultOgImage`.

## 6. hreflang (faz 2)
`<link rel="alternate" hreflang="tr" href=".../tr/..." />` altyapısı hazır; faz 1'de yalnız `tr` üretilir.
