# IMPLEMENTATION_PLAN — Faz 1 uygulama planı

Faz bazlı ilerleme. Bir faz tamamlanmadan bir sonrakine geçilmez.

---

## Faz 0 — Hazırlık
- Docs okundu, stakeholder onayı alındı (veya varsayımlar işaretlendi)
- Logo dosyaları, kartvizit referansı `public/brand/` altında

## Faz 1 — Shell
- Next.js 15 + TS strict + Tailwind v4 + ESLint kurulumu
- `globals.css` içinde design token'lar `@theme` ile
- `layout.tsx`, `Header`, `Footer`, `SkipLink`, `CookieBar`
- `site.config.ts`, `navigation.ts`

## Faz 2 — İçerik modeli
- `content/projects/*` en az 3 örnek proje
- `content/services.ts`, `content/legal/*`
- Zod şeması (`lib/content/adapter.ts`)

## Faz 3 — Sayfalar
- `/` → hero, featured projects, services, corporate, CTA band
- `/hakkimizda`, `/hizmetler`, `/projeler`, `/projeler/[slug]`
- `/iletisim`, `/kvkk`, `/cerez-politikasi`, `/404`

## Faz 4 — Formlar
- `ContactForm` + `QuickContactModal` (RHF + Zod)
- KVKK onay zorunlu
- Success/error state, honeypot
- `/api/contact` route handler — adapter arkasında

## Faz 5 — SEO + A11y
- Metadata API tüm sayfalarda
- `sitemap.ts`, `robots.ts`
- JSON-LD: Organization + RealEstateListing (proje detay)
- Keyboard, focus trap, reduced-motion

## Faz 6 — QA
- Responsive (360→1920)
- Link health, console clean
- Lighthouse hedefleri doğrulandı
