# QA raporu — fazlı doğrulama

Tarih: 23 Ekim 2026 · Hedef: üretim derlemesi (`npm run build:prod`), mobil profil
Ölçütler: [SUCCESS_CRITERIA.md](../00-project/SUCCESS_CRITERIA.md)

Doğrulama ucuzdan pahalıya dört fazda yürütülür. Bir faz düşerse sonraki
fazlar anlamsızdır; sırayla koşulmalıdır.

---

## Faz 0 — Statik kapı

| Kontrol | Komut | Sonuç |
|---|---|---|
| Tip denetimi | `npm run typecheck` | geçti |
| Lint (0 uyarı) | `npm run lint` | geçti |
| Ortam sözleşmesi | `npm run check:env` | geçti |
| İçerik şeması | `npm run validate:content` | geçti |
| Nöbetçiler | `tests/guards/*` | geçti |

## Faz 1 — Birim

`npm run test:unit` → **105/105**

## Faz 2 — Entegrasyon, derleme ve üretim yüzeyleri

| Kontrol | Sonuç |
|---|---|
| E2E (`npm run test:e2e`) | **51/51** |
| Üretim derlemesi | başarılı, paylaşılan ilk yük 103 kB |
| Güvenlik başlıkları (HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP) | altısı da var |
| CSP — herkese açık sayfalar | nonce yok, `strict-dynamic` yok (statik HTML ile uyumlu) |
| CSP — `/admin` | nonce + `strict-dynamic` |
| robots.txt (production) | indekslemeye açık, `/api/` ve `/admin/` hariç |
| sitemap.xml | 11 URL (8 statik + 3 proje) |
| Kanonik / OG / JSON-LD | hepsi yapılandırılmış alan adını gösteriyor |

## Faz 3 — Kabul ölçütleri

### 3a. Responsive ve dokunma

| Kontrol | Sonuç |
|---|---|
| Yatay taşma (360/375/768/1024/1440/1920 × 5 sayfa) | hiçbirinde taşma yok |
| Gövde yazı boyutu | 360px'de 17.8px, 1440px'de 20px (hedef ≥15 / ≥16) |
| Dokunma hedefleri (`pointer: coarse`) | aşağıdaki tek sapma dışında tümü ≥44px |

**Kabul edilen sapma:** footer'daki "KVKK" bağlantısı 39px **genişliğinde**
(yüksekliği 44px). Genişlik metin uzunluğundan gelir; `min-width` dayatmak
kısa bağlantıların etrafında görsel boşluk yaratırdı. WCAG 2.5.8 (AA) 24×24
ister, bu değer onu rahatça geçer.

### 3b. Erişilebilirlik

axe-core, WCAG 2.0/2.1 A + AA, 5 sayfa × 2 genişlik (390px, 1280px):
**serious/critical ihlal: 0**

### 3c. Core Web Vitals

Laboratuvar ölçümü — 390×844, 4× CPU kısıtlaması, ~10 Mbps / 70 ms.
**Saha (field) verisi değildir;** gerçek kullanıcı ölçümü yayın sonrası alınmalıdır.

| Sayfa | LCP (hedef ≤2.5s) | CLS (hedef ≤0.05) |
|---|---|---|
| `/` | 2.04s | 0.000 |
| `/projeler` | 1.63s | 0.000 |
| `/projeler/[slug]` | 2.24s | 0.000 |
| `/iletisim` | 0.98s | 0.000 |

### 3d. Lighthouse skorları

Mobil profil, Lighthouse 13, **simüle Slow 4G** (1.6 Mbps / 150 ms / 4x CPU).
Lighthouse kalıcı bir bağımlılık değildir; `npx lighthouse@13` ile koşulur.

| Sayfa | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Ölçüt (min / hedef) | 80 / 90 | 95 / 100 | 90 / 95 | 95 / 100 |
| `/` | **66** | 100 | 100 | 100 |
| `/projeler/[slug]` | 80 | 100 | 100 | 100 |
| `/iletisim` | 88 | 100 | 100 | 100 |

**Accessibility, Best Practices ve SEO her sayfada 100** — üçü de hedefin
üstünde.

**Ana sayfa Performance ölçütü karşılamıyor (66 < 80).** Bu turda 63'ten
66'ya çıkarıldı ve asıl kazanım skorda değil kullanıcı deneyiminde:

| | Önce | Sonra |
|---|---|---|
| Toplam transfer | ~3.9 MB | **699 KB** |
| LCP (Lighthouse) | 7.2s | **4.7s** |

Kalan darboğaz **ağ değil, CPU**: TBT 690 ms, ana iş parçacığında
Style & Layout ~1.5 s. Yani sorun bir dosyanın büyüklüğü değil, uzun ve
etkileşimli ana sayfanın istemcide render maliyeti.

**80'e çıkarmak için gereken:** ana sayfadaki istemci bileşenlerinin
(`"use client"`) azaltılması ya da ekran altı bölümlerin geç monte
edilmesi. Bu mimari bir değişikliktir, görsel/dosya optimizasyonuyla
kapanmaz — bu turda o yol sonuna kadar gidildi.

> **Not — iki ölçüm neden farklı:** §3c'deki LCP değerleri (hepsi ≤2.2s)
> 10 Mbps / 70 ms ile alınmıştır; Lighthouse 1.6 Mbps / 150 ms kullanır.
> Aynı sayfa, farklı varsayım. Ölçüt Lighthouse metodolojisini şart
> koştuğu için **bağlayıcı olan yukarıdaki tablodur.**

> Bu skorlar yerel sunucuya karşıdır; gerçek sunucunun gecikmesini ve
> gerçek içeriğin ağırlığını yansıtmaz. Yayın sonrası gerçek alan adında
> tekrarlanmalıdır.

---

## Bu turda bulunan ve giderilenler

| Bulgu | Kök neden | Çözüm |
|---|---|---|
| `/projeler` CLS **0.335** (hedefin ~7 katı) | `useSearchParams` için eklenen Suspense yedeği boş bir `div`'di; içerik gelince CTA bandı ~1800px sıçrıyordu | Yedek, aynı süzgeç yüksekliği ve aynı oranda kartlarla yer ayıran bir iskelete çevrildi |
| Renk kontrastı, 4 sayfa | `--color-muted` beyazda 2.97:1 (gereken 4.5:1) | Token `#9a9590 → #706b66` (beyazda 5.27, alt zeminde 4.84) |
| Renk kontrastı, logo ve mesafeler | Açık zeminde `--color-accent` 2.21:1 | O iki yerde `--color-accent-ink` kullanıldı (5.21:1) |
| Dokunma hedefleri 32–42px | Kaba işaretleyici için asgari boyut kuralı yoktu | `@media (pointer: coarse)` altında min 44px; simge düğmeleri için `.touch-icon` |
| Footer bağlantıları 17px | `min-height` satır içi öğelere **uygulanmaz** | O bağlantılara `inline-flex` verildi |
| Ana sayfa 3.9 MB transfer, LCP 7.2s (Lighthouse) | 3.1 MB'lık hero videosu her koşulda iniyordu; hero ve bölüm posterleri `<video poster>` ile ham JPEG olarak gidiyor, Next'in görsel hattını atlıyordu | Video yalnızca geniş ekran + hızlı bağlantı + hareket azaltma kapalıyken yükleniyor; tüm posterler `next/image` (AVIF) üzerinden, ekran altındakiler tembel |
| `/` LCP 2.53s, `/projeler/[slug]` 2.92s | Hero videosu (886KB) LCP posteriyle eşzamanlı iniyordu; hero arka planı CSS'te olduğu için ön tarayıcı geç keşfediyordu | Video `src`'si ilk boyamadan sonra bağlanıyor; poster ve hero görseli `preload` + `fetchpriority=high` |

### Yanlış alarm olduğu doğrulananlar

Bunlar ölçüm yöntemi kaynaklıydı; kod değişmedi:

- **KVKK onay kutusu 13×16** — kutu `<label>` ile sarılı, etkin hedef 358×40
  ve metne dokunmak kutuyu işaretliyor (tarayıcıda doğrulandı).
- **"Menüyü kapat" 43×43** — menü kapalıyken panelde 0.98 ölçekli kapanış
  animasyonu var. Menü açıkken ölçü tam 44.0×44.0.

---

## Tekrar koşmak için

```bash
# Faz 0
npm run typecheck && npm run lint && npm run check:env && npm run validate:content

# Faz 1
npm run test:unit

# Faz 2
npm run test:e2e
NEXT_PUBLIC_APP_ENV=production NEXT_PUBLIC_SITE_URL=https://alan-adiniz npm run build:prod

# Faz 3 — üretim sunucusuna karşı; betikler bu turda geçici olarak yazıldı,
# yeniden gerekirse Playwright + axe-core ile kurulur (ikisi de bağımlılıkta mevcut)
```

> Faz 3 ölçümleri gerçek alan adı ve gerçek içerikle yayına alındıktan sonra
> **tekrarlanmalıdır**: görsel ağırlıkları ve metin uzunlukları değişince
> LCP ve CLS de değişir.
