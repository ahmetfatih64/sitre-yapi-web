# FILE_STRUCTURE — Kod klasör yapısı

```
sitre_yapi_project/
├── package.json
├── tsconfig.json
├── next.config.ts
├── next-env.d.ts
├── postcss.config.mjs
├── .env.example
├── .gitignore
├── public/
│   ├── brand/                 # logo, kartvizit
│   └── images/
│       ├── og/
│       ├── projects/[slug]/   # cover, gallery, plans
│       └── placeholders/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx                       # /
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── hakkimizda/page.tsx
│   │   ├── projeler/page.tsx
│   │   ├── projeler/[slug]/page.tsx
│   │   ├── hizmetler/page.tsx
│   │   ├── iletisim/page.tsx
│   │   ├── kvkk/page.tsx
│   │   ├── cerez-politikasi/page.tsx
│   │   └── api/contact/route.ts
│   ├── components/
│   │   ├── layout/     # Header, Footer, CookieBar, SkipLink
│   │   ├── sections/   # hero, featured, services, cta, project-*
│   │   ├── ui/         # Container, Button, Badge, SectionHeading, ProjectCard
│   │   └── forms/      # ContactForm, QuickContactModal, fields
│   ├── content/
│   │   ├── site.config.ts
│   │   ├── navigation.ts
│   │   ├── services.ts
│   │   ├── projects/
│   │   │   ├── index.ts
│   │   │   ├── sitre-urla-konaklari.ts
│   │   │   ├── sitre-cesme-residence.ts
│   │   │   └── sitre-bornova-park.ts
│   │   └── legal/
│   │       ├── kvkk.ts
│   │       └── cerez-politikasi.ts
│   └── lib/
│       ├── seo.ts
│       ├── utils.ts
│       ├── forms/
│       │   ├── schema.ts
│       │   └── backend.ts
│       └── content/
│           └── adapter.ts
└── docs/                      # spesifikasyon ve içerik rehberi
```

**Kurallar:**
- `src/app/(pages)` altı dosyaları server component varsayılan; yalnız gerekli yerlerde `"use client"`.
- Tüm içerik `src/content/*` altında; bileşen JSX'ine sabit metin gömülmez.
- Tüm design token değerleri `src/app/globals.css` `@theme` bloğu içinden gelir.
