# AGENTS.md — Claude için ana çalışma kuralı

Bu dosya, Claude (ve diğer kodlama ajanlarının) bu depoda nasıl çalışacağını tanımlar. **Her görevden önce** buradaki okuma sırası ve kurallar takip edilir. Kural çakışması olursa: bu dosya → ilgili `docs/**/*.md` → kaynak kod sırasına göre otoritedir.

---

## 1. Okuma sırası (her görevde)

Yeni bir göreve başlarken **en az şu dosyalar** okunmalı:

1. [AGENTS.md](AGENTS.md) — bu dosya
2. [README.md](README.md) — depo ve stack özeti
3. [docs/00-project/PROJECT_BRIEF.md](docs/00-project/PROJECT_BRIEF.md) — proje amacı, hedef kitle, konumlandırma
4. [docs/00-project/SCOPE.md](docs/00-project/SCOPE.md) — bu fazın kapsamı
5. [docs/00-project/SUCCESS_CRITERIA.md](docs/00-project/SUCCESS_CRITERIA.md) — başarı ölçütleri
6. Göreve göre **ilgili** `docs/**/*.md` dosyaları (içerik, tasarım, mimari)
7. [reference/DESIGN.md](reference/DESIGN.md) — referans site analizi (yalnızca davranış/yapı için)

> Kural: bir `.md` dosyasını değiştiren veya onun kapsadığı alanda iş yapan her görev, o `.md`’yi **önce okur**.

---

## 2. Yapılacaklar sırası (implementation order)

Faz bazlı ilerleme — detayı [docs/06-engineering/IMPLEMENTATION_PLAN.md](docs/06-engineering/IMPLEMENTATION_PLAN.md).

1. **Docs fazı** — bu repodaki docs tamamlanır, stakeholder onayı alınır
2. **Shell** — Next.js iskeleti, Tailwind, token katmanı, layout, header/footer
3. **Pages** — ana sayfa → hakkımızda → projeler liste → proje detay şablonu → iletişim → yasal metinler
4. **Components** — ortak bileşenler (hero, slider, modal, form, card, cta)
5. **Animations** — motion, hover, entrance
6. **Forms** — validation, quick-contact, ana iletişim, KVKK onayı
7. **SEO** — metadata, sitemap, robots, JSON-LD, OG
8. **QA** — checklistler, responsive, accessibility, performans

> Bir faz tamamlanmadan bir sonraki faza geçilmez. İçinde bulunulan faz dışı değişiklikler **plan dışı** sayılır.

---

## 3. Kod standartları

- **Dil:** TypeScript, `strict: true`. `any` gerekçesiz kullanılmaz.
- **Stil:** Tailwind ile utility-first; tekrar eden kalıplar bileşene çıkarılır. Tasarım token’larına [docs/04-design/DESIGN_SYSTEM.md](docs/04-design/DESIGN_SYSTEM.md) üzerinden erişilir — sabit hex/px değerleri bileşen içine gömülmez.
- **Bileşen adlandırma:** `PascalCase` dosya ve komponent ismi, `kebab-case` klasör.
- **Import sırası:** external → alias (`@/`) → göreli.
- **Yorum politikası:** WHY yazılır, WHAT değil. Bileşen başına kısa bir açıklama yeterli; paragraflar halinde docstring yazılmaz.
- **Client/server:** Varsayılan server component; yalnızca etkileşim gerektiği yerde `"use client"`.
- **Görsel:** Her zaman `next/image` (veya projenin belirlediği sarmalayıcı). `alt` zorunlu.
- **Erişilebilirlik:** focus-visible stili korunur; modal’lar focus trap + escape; form hataları `aria-describedby` ile duyurulur. Detay: [docs/06-engineering/ACCESSIBILITY.md](docs/06-engineering/ACCESSIBILITY.md).
- **Performans:** görsel boyut/format, code splitting, motion for reduced-motion uyumu. Detay: [docs/06-engineering/PERFORMANCE.md](docs/06-engineering/PERFORMANCE.md).

---

## 4. Kullanılacak stack

Kesin liste: [docs/06-engineering/TECH_ARCHITECTURE.md](docs/06-engineering/TECH_ARCHITECTURE.md). Özet:

- Next.js (App Router) + TypeScript
- Tailwind CSS + token katmanı
- Framer Motion
- Swiper
- React Hook Form + Zod
- next/image, metadata API
- pnpm paket yöneticisi

> Yeni bir üçüncü parti paket eklenmeden önce `TECH_ARCHITECTURE.md` güncellenir ve gerekçe yazılır.

---

## 5. “Done” tanımı

Bir görev yalnızca şunların **hepsi** sağlandığında “done” sayılır:

- [ ] İlgili `docs/**` dosyaları okundu ve gerekliyse güncellendi
- [ ] Tasarım token’larına uyuldu; sabit renk/spacing kaçağı yok
- [ ] Responsive (mobil → desktop) doğrulandı
- [ ] Erişilebilirlik kontrolleri yapıldı (klavye, focus, alt, aria)
- [ ] Kırık link / boş `href` / boş `src` yok
- [ ] Form varsa: validation, hata state, success state, KVKK onayı çalışıyor
- [ ] SEO gerekli alanlar (title, description, og, canonical) dolu
- [ ] Lighthouse hedefleri: mobile Perf ≥ 85, A11y ≥ 95, SEO ≥ 95 (hedef; final ölçüt [SUCCESS_CRITERIA.md](docs/00-project/SUCCESS_CRITERIA.md))
- [ ] Console error yok
- [ ] QA checklist’te ilgili maddeler işaretlendi

---

## 6. Yasaklar

- **Telifli kopya yok.** [reference/DESIGN.md](reference/DESIGN.md) ve herhangi bir canlı siteden metin/fotoğraf/logo/video birebir kopyalanmaz. Referans yalnızca **yapı, davranış ve etkileşim** için kullanılır; içerik [docs/03-content/](docs/03-content/) altındaki Sitre Yapı’ya özgü metinlerden alınır.
- **Canlı key yok.** Analytics, reCAPTCHA, harita, form backend anahtarları repoya commit edilmez. Tümü env üzerinden.
- **Broken href yok.** `href="#"`, boş `href`, ölü route, 404 veren iç link merge edilmez. Navigasyon tutarlılığı için [docs/02-ia/ROUTES_AND_SLUGS.md](docs/02-ia/ROUTES_AND_SLUGS.md).
- **Spekülatif soyutlama yok.** Üç defadan az tekrar eden desen bileşene çıkarılmaz.
- **Yarım iş yok.** Bir bileşen eklendiyse responsive + a11y + içerik + boş state birlikte tamamlanır.
- **Docs dışı içerik kaçağı yok.** UI metinleri doğrudan bileşene gömülmez; [docs/03-content/](docs/03-content/) altındaki içerik dosyalarına veya i18n/content katmanına bağlanır.
- **Amaçsız commit yok.** Her commit mesajı bir işi özetler; “wip”, “fix”, “update” tek başına kabul edilmez.

---

## 7. Her işten önce ilgili `.md` okunacak — kuralın kısa hali

> **“Dokun, önce oku.”**
> Bir `docs/` dosyasının kapsadığı alanda iş yapıyorsan, kod yazmadan önce o dosyayı oku. İçerik değiştiriyorsan ilgili `03-content/` dosyasını güncelle. Tasarım değiştiriyorsan `04-design/` içindeki ilgili dosyayı güncelle. Dokümana girmeyen karar, **karar sayılmaz**.

---

## 8. Alt-`AGENTS.md` dosyaları

İleride `app/`, `src/components/`, `src/content/` gibi alt dizinler kendi `AGENTS.md` dosyalarını içerebilir. Alt dosya ⊃ üst dosya (özel, geneli ezer). Çakışma olursa en yakın `AGENTS.md` kazanır, ancak **bu dosyadaki yasaklar her zaman geçerlidir**.
