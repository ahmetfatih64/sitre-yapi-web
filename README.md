# Sitre Yapı — Kurumsal Web Sitesi

Sitre Yapı için üretilecek premium kurumsal web sitesinin monorepo’su. Bu depo hem **dokümantasyon** hem de **uygulama kodu** için tek kaynaktır. Tüm çalışma kuralları [AGENTS.md](AGENTS.md) dosyasındadır; kodlamadan önce oradaki okuma sırası takip edilmelidir.

---

## Amaç

- Sitre Yapı’nın kurumsal kimliğini, projelerini ve hizmetlerini üst segment bir dille sunan, modern, hızlı, erişilebilir bir kurumsal site.
- Proje detay sayfaları için ölçeklenebilir bir şablon: hero, konsept, lokasyon, galeri, sosyal olanaklar, vaziyet planı, daire/plan tipleri, 360 modal, quick-contact.
- Mobil-öncelikli, SEO-hazır, içerik güncellemesi kolay bir yapı.

Ayrıntı: [docs/00-project/PROJECT_BRIEF.md](docs/00-project/PROJECT_BRIEF.md), [docs/00-project/SCOPE.md](docs/00-project/SCOPE.md).

---

## Stack (önerilen)

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + tasarım token katmanı
- **Framer Motion** (motion) — giriş animasyonları ve sayfa geçişleri
- **Swiper** — galeri, plan ve olanak slider’ları
- **React Hook Form + Zod** — form doğrulama
- **next/image** — görsel optimizasyonu
- **next-seo / metadata API** — SEO ve JSON-LD
- Form backend ve analytics için env tabanlı entegrasyon (bkz. [docs/06-engineering/THIRD_PARTY_INTEGRATIONS.md](docs/06-engineering/THIRD_PARTY_INTEGRATIONS.md))

Tam mimari: [docs/06-engineering/TECH_ARCHITECTURE.md](docs/06-engineering/TECH_ARCHITECTURE.md).

---

## Klasör yapısı (üst seviye)

```
.
├── README.md                 # Bu dosya
├── AGENTS.md                 # Claude için ana çalışma kuralı — önce oku
├── docs/                     # Tüm spesifikasyon ve içerik dosyaları
│   ├── 00-project/           # Brief, scope, başarı kriterleri
│   ├── 01-brand/             # Marka stratejisi, ton, görsel yön
│   ├── 02-ia/                # Bilgi mimarisi, sitemap, route’lar
│   ├── 03-content/           # Sayfa metinleri, içerik modelleri
│   ├── 04-design/            # Tasarım sistemi, bileşenler, şablonlar
│   ├── 05-seo/               # SEO stratejisi, metadata, linkleme
│   ├── 06-engineering/       # Mimari, veri şeması, uygulama planı
│   ├── 07-qa/                # Kabul kriterleri, checklist’ler
│   ├── 08-handoff/           # Deploy ve teslim
│   └── 99-prompts/           # Claude için yapılandırılmış promptlar
├── reference/                # Salt-okunur referans dosyaları
│   ├── AGENT.md              # Claude ekosistemi özeti (yerel repolar)
│   └── DESIGN.md             # Folkart Orion referans tasarım analizi
└── (ileride) app/, src/, public/, tests/ …
```

Kod tarafındaki kesin klasör yapısı için: [docs/06-engineering/FILE_STRUCTURE.md](docs/06-engineering/FILE_STRUCTURE.md).

---

## Kurulum (uygulama kodu eklendiğinde)

```bash
# Gereksinimler
node -v   # >= 20
pnpm -v   # veya npm / yarn

# Bağımlılıklar
pnpm install

# Geliştirme
pnpm dev

# Üretim build
pnpm build && pnpm start
```

Env değişkenleri `.env.local` içine yazılır; şablon ve zorunlu anahtarlar için [docs/06-engineering/THIRD_PARTY_INTEGRATIONS.md](docs/06-engineering/THIRD_PARTY_INTEGRATIONS.md).

---

## Çalışma akışı (kısa)

1. **Önce oku:** [AGENTS.md](AGENTS.md) → [docs/00-project/PROJECT_BRIEF.md](docs/00-project/PROJECT_BRIEF.md) → ilgili docs dosyaları → [reference/DESIGN.md](reference/DESIGN.md).
2. **Planla:** [docs/06-engineering/IMPLEMENTATION_PLAN.md](docs/06-engineering/IMPLEMENTATION_PLAN.md) içindeki fazlara göre.
3. **Kodla:** [docs/04-design/DESIGN_SYSTEM.md](docs/04-design/DESIGN_SYSTEM.md) token’larına ve bileşen envanterine uy.
4. **Doğrula:** [docs/07-qa/QA_CHECKLIST.md](docs/07-qa/QA_CHECKLIST.md) ve [docs/07-qa/ACCEPTANCE_CRITERIA.md](docs/07-qa/ACCEPTANCE_CRITERIA.md).

---

## Deploy notları

- Hedef: statik/edge-friendly deployment (Vercel veya eşdeğeri).
- Form backend, analytics ve harita anahtarları env üzerinden verilir, repoya commit edilmez.
- Canlıya çıkış öncesi: [docs/07-qa/PRELAUNCH_CHECKLIST.md](docs/07-qa/PRELAUNCH_CHECKLIST.md).

---

## Yasaklar

- Referans sitelerden **telifli metin, fotoğraf, logo, video kopyalanmaz**. [reference/DESIGN.md](reference/DESIGN.md) yalnızca **davranış ve yapı** referansıdır.
- Canlı API anahtarları repoya commit edilmez.
- Kırık link / boş href ile merge yapılmaz.

Detay: [AGENTS.md](AGENTS.md).
