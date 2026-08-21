# TECH_ARCHITECTURE — Sitre Yapı web mimarisi

Bu dosya uygulamanın teknik mimarisini, stack seçimlerini ve bunların **nedenlerini** tanımlar. Yeni bir bağımlılık veya mimari karar bu dosya güncellenmeden kod tarafına girmez.

---

## 1. Hedefler

- **Hızlı**, mobil-öncelikli, SEO-hazır kurumsal site
- **Ölçeklenebilir** proje detay şablonu (yeni proje = yeni içerik kaydı)
- **İçerik-kod ayrımı** — içerik güncellemek kod değiştirmek anlamına gelmez
- **Çok dilli altyapı hazır** (faz 2 aktivasyonu için)
- **Edge / statik deploy** dostu

Bu hedefler teknoloji seçimlerini sürekli sınar. Bir kararı değerlendirirken: “bu hedeflerden hangisini ne kadar iyi karşılıyor?”

---

## 2. Stack

### 2.1 Framework — Next.js (App Router)
- **Neden:** React tabanlı, file-based routing, metadata API, image optimization, ISR/SSG/SSR karışık model, Vercel ile pürüzsüz deploy, i18n altyapısı, edge-friendly.
- **Sürüm:** en güncel stabil major (14+).
- **Router:** App Router (`app/`), Pages Router kullanılmaz.

### 2.2 Dil — TypeScript
- `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`.
- İçerik şemaları TypeScript tipleriyle çift doğrulanır (Zod + TS).

### 2.3 Stil — Tailwind CSS + token katmanı
- **Neden:** utility-first hız + token ile marka tutarlılığı.
- Sabit renk/spacing **bileşen içine gömülmez**; tüm değerler Tailwind config’e [DESIGN_SYSTEM.md](../04-design/DESIGN_SYSTEM.md) token’larından türetilir.
- Ek: `@tailwindcss/typography` yalnız uzun-form yasal metinler için.

### 2.4 Motion — Framer Motion
- **Neden:** deklaratif, reduced-motion desteği kolay, Next.js ile uyumlu.
- Kullanım sadece **belirli bileşenlerde**: hero entrance, section fade, modal, hover micro-interaction.
- Hero/section entrance’lar server-render’a dokunmaz; client-boundary küçük tutulur.

### 2.5 Slider — Swiper
- **Neden:** galeri, sosyal olanaklar, plan tipleri için olgun, erişilebilir, dokunma uyumlu.
- Keyboard navigation zorunlu, pagination erişilebilir.

### 2.6 Form — React Hook Form + Zod
- **Neden:** minimum re-render, Zod ile aynı şemanın hem client hem server doğrulamasında kullanılması.
- KVKK checkbox zorunlu alan.
- Server action veya route handler üzerinden backend’e post; response’ta başarı/hata state’i.

### 2.7 Görsel — next/image
- **Neden:** otomatik responsive, AVIF/WebP, lazy loading, CLS koruması.
- Tüm görseller bu bileşen üzerinden; `<img>` kullanılmaz.
- Remote pattern whitelist `next.config` içinde.

### 2.8 SEO — Metadata API + `next-sitemap`
- Metadata API ile her route’ta title/description/OG/canonical.
- `next-sitemap` (veya eşdeğer) ile `/sitemap.xml` ve `/robots.txt` üretimi.
- JSON-LD `<Script type="application/ld+json">` ile server-render.
- Detay: [METADATA_AND_SCHEMA.md](../05-seo/METADATA_AND_SCHEMA.md)

### 2.9 Paket yöneticisi — pnpm
- **Neden:** disk verimli, monorepo’ya hazır, workspace desteği.

### 2.10 Lint / format
- ESLint (Next.js preset + a11y kuralları + import order)
- Prettier
- Commit öncesi `lint-staged` + `husky` (opsiyonel)

### 2.11 Test (minimum)
- Birim: Vitest + React Testing Library (yalnızca non-trivial bileşen ve yardımcılar için)
- E2E: Playwright (form akışı, modal, navigasyon smoke test)
- Test kapsamı zorunlu değildir ama form, modal ve navigation için smoke test vardır.

---

## 3. İçerik katmanı

### 3.1 Kaynak
Faz 1 içerik kaynağı **repo-içi dosyalar**:
```
content/
├── site.config.json          # menü, footer, global
├── pages/
│   ├── home.mdx
│   ├── about.mdx
│   ├── services.mdx
│   ├── contact.mdx
│   ├── kvkk.mdx
│   └── cerez-politikasi.mdx
├── projects/
│   ├── [slug].mdx            # proje detay, frontmatter + body
│   └── [slug]/
│       ├── gallery/
│       └── plans/
└── i18n/
    ├── tr/
    └── en/                   # faz 2
```
- MDX veya JSON — section bazında: yapısal veri JSON/YAML, uzun metin MDX frontmatter + body.
- Şema doğrulaması: Zod ile build-time. Hatalı içerik build’i kırar — bu istenen davranıştır.

### 3.2 Erişim
- Build-time (SSG) okuma: `generateStaticParams` + `generateMetadata`.
- Proje detay sayfaları tamamen statik, ISR opsiyonel.

### 3.3 Faz 2 CMS göçü
- İçerik API’si bir adaptör arkasında gizlenir (`lib/content/adapter.ts`).
- Faz 1 adaptörü: file system reader.
- Faz 2 adaptörü: headless CMS (Sanity/Contentful/Payload — karar faz 2’de).
- Sayfa kodu adaptöre bağlıdır, kaynağa değil — değişim CMS’ye kolay geçişi sağlar.

---

## 4. i18n altyapısı

- Next.js i18n routing yapısı hazır ama faz 1’de tek dil (`tr`).
- Metinler `content/i18n/tr/*.json` veya MDX frontmatter’dan gelir; JSX içine gömülmez.
- Dil seçici bileşeni yazılır ama faz 1’de `hidden`.
- `hreflang` altyapısı hazırlanır, faz 1’de yalnız `tr` üretilir.

---

## 5. Form backend

- Bir adaptör arkasında: `lib/forms/backend.ts`.
- Faz 1 olasılıklar:
  - **Resend / kendi SMTP** — server action ile mail gönderim
  - **Formspree / Web3Forms** — basit entegrasyon
  - **Kendi API route’u + webhook** — CRM’e push
- Karar stakeholder ile netleşir; kod tarafı adaptör sözleşmesine bağlıdır, backend değişse değişmez.
- reCAPTCHA v3 veya honeypot zorunlu.
- Env: `FORM_BACKEND`, `FORM_BACKEND_KEY`, `RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`.

---

## 6. Analytics ve ölçüm

- **GA4** — ana analitik. Consent sonrası yüklenir.
- **Core Web Vitals** — `next/web-vitals` ile GA4’e raporlanır.
- Opsiyonel: Microsoft Clarity veya Hotjar (stakeholder kararı).
- Event’ler: `form_submit`, `quick_contact_open`, `project_card_click`, `gallery_open`.

---

## 7. Harita

- **Google Maps JS** veya **Mapbox GL JS** — karar stakeholder’a bağlı.
- Yalnız iletişim ve proje detay lokasyon section’ında yüklenir.
- Consent/cookie kategorisi “harici içerik” olarak işaretlenir.

---

## 8. Performans stratejisi

- **RSC öncelikli:** interaksiyon olmayan bileşen server component.
- **Client boundary küçük:** slider, modal, form gibi sadece gerekli yerlerde `"use client"`.
- **Image optimization:** kapak görselleri `priority`, alt görseller lazy.
- **Font:** `next/font` ile self-host, `display: swap`, `preload` kritik ağırlıklar.
- **Script:** üçüncü parti (GA4, reCAPTCHA, Maps) `next/script` + uygun `strategy`.
- **Bundle:** route bazlı split, shared ≤ 180KB hedef.
- Detay: [PERFORMANCE.md](PERFORMANCE.md)

---

## 9. Erişilebilirlik

- Semantik HTML, tek `h1`, landmark elementler (`header`, `nav`, `main`, `footer`).
- Focus-visible stili korunur, focus trap modallarda, skip-link.
- Slider’lar klavye ile gezilebilir.
- Form hataları `aria-live="polite"` ile duyurulur.
- Detay: [ACCESSIBILITY.md](ACCESSIBILITY.md)

---

## 10. Env standardı

```
# .env.local (asla commit edilmez)
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
FORM_BACKEND=
FORM_BACKEND_KEY=
MAP_PROVIDER=
MAP_API_KEY=
```
- `NEXT_PUBLIC_*` client’a sızabilecekleri, diğerleri yalnız server.
- `.env.example` commit edilir, `.env.local` edilmez.
- Detay: [THIRD_PARTY_INTEGRATIONS.md](THIRD_PARTY_INTEGRATIONS.md)

---

## 11. Deploy

- **Hedef platform:** Vercel (veya eşdeğer edge platformu)
- **Branch akışı:**
  - `main` → production
  - `develop` → staging (noindex)
  - feature branch → preview
- **Preview:** her PR için otomatik preview URL.
- **Staging:** `robots.txt` `Disallow: /`, meta `noindex`.
- **Prod:** analytics aktif, konsol temiz.

---

## 12. Klasör yapısı (kesin liste için ayrı dosya)

Detay: [FILE_STRUCTURE.md](FILE_STRUCTURE.md). Üst seviye özet:
```
app/
  (site)/
    page.tsx                # /
    hakkimizda/page.tsx
    projeler/page.tsx
    projeler/[slug]/page.tsx
    hizmetler/page.tsx
    iletisim/page.tsx
    kvkk/page.tsx
    cerez-politikasi/page.tsx
  layout.tsx
  not-found.tsx
src/
  components/
  lib/
    content/                # adapter + readers
    forms/                  # backend adapter + schema
    seo/                    # metadata helpers
    analytics/
  styles/
content/
public/
  fonts/
  images/
```

---

## 13. Kararlar — karar kaydı

| Konu | Karar | Gerekçe |
|---|---|---|
| Framework | Next.js App Router | RSC + metadata + image + i18n tek paket |
| Dil | TypeScript strict | İçerik şemalarıyla uçtan uca tip güvenliği |
| Stil | Tailwind + token | Hız + marka tutarlılığı |
| Motion | Framer Motion | Reduced-motion ve Next.js uyumu |
| Slider | Swiper | Erişilebilirlik + dokunma |
| Form | RHF + Zod | Tek şema, minimum re-render |
| İçerik | File system + MDX/JSON | Faz 1 için yeterli, CMS adaptörü ile faz 2’ye açık |
| Paket yöneticisi | pnpm | Disk ve workspace |

Yeni bir karar alındığında bu tablonun altına satır eklenir; eski karar değişirse üstü çizilip (~~eski~~) yerine yazılır.
