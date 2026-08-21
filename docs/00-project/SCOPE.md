# SCOPE — Bu fazda yapılacaklar / yapılmayacaklar

Bu dosya **Faz 1**’in kapsamını tanımlar. Kapsam dışı talepler [docs/08-handoff/FUTURE_ROADMAP.md](../08-handoff/FUTURE_ROADMAP.md)’a taşınır. Kapsam değişikliği için bu dosya ve [PROJECT_BRIEF.md](PROJECT_BRIEF.md) birlikte güncellenir.

---

## Yapılacaklar (In-Scope)

### Sayfalar
- **Ana sayfa** — hero, marka vaadi, öne çıkan projeler, hizmet özetleri, kurumsal özet, CTA
- **Hakkımızda** — kurum hikayesi, değerler, süreç, (opsiyonel) ekip özeti
- **Projeler listeleme** — aktif / tamamlanan / yakında filtreleri, kart grid, (opsiyonel) lokasyon filtresi
- **Proje detay şablonu** — tek şablon, birden çok projeye uyarlanabilir. Section listesi [docs/03-content/PROJECT_DETAIL_TEMPLATE_CONTENT.md](../03-content/PROJECT_DETAIL_TEMPLATE_CONTENT.md)
- **Hizmetler** — Sitre Yapı’nın sunduğu ana hizmet alanları
- **İletişim** — form, ofis adresi/harita, çalışma saatleri, telefon, mail
- **KVKK / aydınlatma metni**
- **Çerez politikası**
- **404** — marka tonuyla

### Fonksiyonlar
- **Quick contact modal** — her proje detayında ve proje kartlarında açılabilir
- **Ana iletişim formu** — iletişim sayfasında, validation + KVKK onay + success/error state
- **Çerez bandı** — temel consent banner, tercih saklama
- **Harita entegrasyonu** — iletişim sayfası ve proje detay (lokasyon section)
- **Galeri** — proje detay içinde, lightbox/fullscreen
- **Plan/daire tipi slider’ı** — proje detayda kategorili
- **360° görüntü modal** (opsiyonel, proje varlığına bağlı) — placeholder ile hazır
- **Çok dilli altyapı hazır** — i18n yapısı kurulu, ilk fazda yalnız `tr` aktif

### Teknik
- Next.js + TypeScript + Tailwind + motion + Swiper + RHF + Zod
- next/image ile görsel optimizasyonu
- Metadata API + sitemap + robots + JSON-LD
- Form backend entegrasyonu (env ile)
- Analytics (GA4) entegrasyonu
- Responsive (360px → 1920px+)
- Erişilebilirlik: WCAG 2.1 AA hedef
- Lighthouse hedefleri (bkz. [SUCCESS_CRITERIA.md](SUCCESS_CRITERIA.md))

### Dokümantasyon
- Bu `docs/` ağacının tamamı
- İçerik güncelleme ve yeni proje ekleme rehberi ([docs/08-handoff/DEPLOYMENT_AND_HANDOFF.md](../08-handoff/DEPLOYMENT_AND_HANDOFF.md))

---

## Yapılmayacaklar (Out-of-Scope — Faz 1)

- **Blog / insights / haber modülü** — altyapı hazırlanır ama sayfa üretilmez. Faz 2.
- **Headless CMS kurulumu** — içerik faz 1’de markdown/JSON olarak gelir. CMS faz 2.
- **Gerçek 360° tur üretimi** — sadece modal placeholder ve embed hazır. İçerik sağlanırsa aktifleşir.
- **Kullanıcı hesabı / portal / favori projeler** — yok.
- **E-ticaret / rezervasyon / ödeme** — yok.
- **Gerçek zamanlı chat / canlı destek widget** — yok (AI sales widget faz 2 opsiyonel).
- **Yatırımcı ilişkileri sayfası** — yok. Faz 2.
- **Kariyer / İK portalı** — yok. Faz 2.
- **Proje karşılaştırma özelliği** — yok. Faz 2.
- **Çok dil aktivasyonu** — altyapı hazır, çeviri içeriği ve dil seçici UI faz 2. Faz 1 yalnızca `tr`.
- **Derin CRM entegrasyonu** — form → mail ve basit webhook yeterli; CRM pipeline faz 2.
- **A/B testing altyapısı** — yok.
- **PWA / offline** — yok.
- **3D/VR model görüntüleyici** — yok.

---

## Varsayımlar

- İçerik (metin + görsel + video) Sitre Yapı tarafından sağlanacak; biz yapı ve placeholder hazırlayacağız.
- Hukuki metinler (KVKK, çerez, aydınlatma) müşterinin hukuk danışmanından gelecek; biz taslak üretebiliriz ama final onay bizim dışımızda.
- Marka kimliği (logo, ana renk, font) Faz 1 başında onaylı olacak. Yoksa ilk sprint bir marka yön atölyesiyle başlar.
- Hosting: Vercel veya eşdeğeri edge platformu.
- Domain ve DNS erişimi müşteride; launch öncesi 1 hafta önce devredilir.

---

## Riskler

| Risk | Etki | Azaltma |
|---|---|---|
| İçerik gecikmesi | Yüksek | Placeholder-first yaklaşım, içerik beklenmeden shell tamamlanır |
| Marka asset eksikliği | Orta | Faz 0’da küçük bir marka yön netleştirme oturumu |
| Proje fotoğrafı eksik | Yüksek | Çekim briefi hazırlanır, eksikse profesyonel çekim planlanır |
| Form backend kararının gecikmesi | Düşük | Kod form abstraction ile yazılır, backend adaptörü sonradan takılır |
| Çok dil baskısının faza dönmesi | Orta | i18n altyapısı faz 1’de hazır, yalnız aktivasyon faz 2 |
