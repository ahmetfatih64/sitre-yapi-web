# DESIGN_SYSTEM — Sitre Yapı tasarım token’ları

Bu dosya, tasarım ve kod arasında köprü kuran **tek kaynak**tır. Tailwind config ve CSS değişkenleri buradaki token’lardan üretilir. Bileşenlerin içine sabit hex, px veya ms gömülmez — her değer buradan gelir.

> Token değerleri taslaktır; marka kılavuzu onaylandıkça güncellenir. Değer değişiklikleri bu dosyada yapılır, kod tarafı otomatik yansır.

---

## 1. Renkler

### 1.1 Marka ve yüzey

| Token | Değer (taslak) | Kullanım |
|---|---|---|
| `--color-brand` | `#2B2A28` (koyu antrasit) | Ana metin, birincil button |
| `--color-brand-soft` | `#4A4744` | İkincil metin, hover state |
| `--color-accent` | `#8D7C6A` (taupe) | Aksan, alt başlık vurgusu |
| `--color-accent-soft` | `#C1B567` | Sınırlı vurgu, (referanstan esin) |
| `--color-bg` | `#FFFFFF` | Varsayılan sayfa arka planı |
| `--color-bg-alt` | `#F7F5F2` | Section arka planı |
| `--color-bg-dark` | `#14100D` | Hero ve dark section’lar |
| `--color-surface` | `#FFFFFF` | Kart, modal |
| `--color-border` | `#E6E2DD` | Çizgi, ayraç |
| `--color-muted` | `#9A9590` | Yardımcı metin |

### 1.2 State

| Token | Değer | Kullanım |
|---|---|---|
| `--color-success` | `#2E7D4F` | Form success |
| `--color-error` | `#B4433A` | Form hatası |
| `--color-warning` | `#C8931D` | Bildirim |
| `--color-focus-ring` | `#8D7C6A` (accent) | Focus ring |

### 1.3 Kontrast kuralı
- Metin / arka plan kontrastı WCAG AA (≥ 4.5:1) sağlanır.
- Büyük başlıklar AA Large (≥ 3:1) ile geçerli.

---

## 2. Tipografi

### 2.1 Font ailesi (taslak)

| Token | Değer | Kullanım |
|---|---|---|
| `--font-display` | `"Canela", "Playfair Display", serif` | Büyük başlıklar |
| `--font-body` | `"Inter", "Helvetica Neue", sans-serif` | Gövde, UI |
| `--font-mono` | `"JetBrains Mono", monospace` | Nadiren, etiket vb. |

> Font seçimi marka kılavuzu onaylandığında netleşir. Ücretli font’lar için variable font dosyaları `/public/fonts/` altına konur ve `next/font/local` ile yüklenir.

### 2.2 Type scale (modular)

| Token | Desktop | Mobile | Kullanım |
|---|---|---|---|
| `--font-size-xs` | 12px | 12px | Rozet, meta |
| `--font-size-sm` | 14px | 14px | Küçük metin |
| `--font-size-base` | 16px | 15px | Gövde |
| `--font-size-lg` | 18px | 16px | Alt-gövde |
| `--font-size-xl` | 22px | 18px | Vurgulu paragraf |
| `--font-size-2xl` | 28px | 22px | h4 |
| `--font-size-3xl` | 36px | 26px | h3 |
| `--font-size-4xl` | 48px | 32px | h2 |
| `--font-size-5xl` | 64px | 40px | h1 |
| `--font-size-display` | 96px | 56px | Hero watermark başlık |

### 2.3 Line-height

| Token | Değer |
|---|---|
| `--leading-tight` | 1.1 |
| `--leading-snug` | 1.25 |
| `--leading-normal` | 1.5 |
| `--leading-relaxed` | 1.7 |

### 2.4 Letter-spacing

| Token | Değer | Kullanım |
|---|---|---|
| `--tracking-tight` | -0.02em | Display |
| `--tracking-normal` | 0 | Gövde |
| `--tracking-wide` | 0.08em | Uppercase etiket |
| `--tracking-widest` | 0.18em | Küçük üst başlıklar |

### 2.5 Heading hiyerarşisi kuralı
- Her sayfada tek `h1`.
- `h2` → section başlığı. `h3` → alt başlık.
- Display stili görsel etkidir; semantik heading seviyesini takip eder.

---

## 3. Spacing

4px tabanlı skala (mobil ve desktop aynı):

| Token | Değer |
|---|---|
| `--space-0` | 0 |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 40px |
| `--space-8` | 56px |
| `--space-9` | 72px |
| `--space-10` | 96px |
| `--space-11` | 128px |
| `--space-12` | 160px |

**Section padding kuralı:**
- Mobile: `--space-9` (72px) dikey padding
- Desktop: `--space-11` (128px) dikey padding
- Hero: bir basamak daha büyük

---

## 4. Radius

| Token | Değer | Kullanım |
|---|---|---|
| `--radius-none` | 0 | Sharp kartlar, hero |
| `--radius-xs` | 2px | İnce detay |
| `--radius-sm` | 6px | Input, small button |
| `--radius-md` | 10px | Kart |
| `--radius-lg` | 16px | Modal |
| `--radius-xl` | 24px | Büyük kart |
| `--radius-full` | 9999px | Pill, avatar |

**Marka eğilimi:** Sitre Yapı sharp / düşük-radius kullanır — yumuşak yuvarlama aksesuardır.

---

## 5. Shadow (elevation)

| Token | Değer (taslak) | Kullanım |
|---|---|---|
| `--shadow-none` | none | Varsayılan |
| `--shadow-sm` | `0 1px 2px rgba(20,16,13,0.06)` | Input hover |
| `--shadow-md` | `0 6px 20px rgba(20,16,13,0.08)` | Kart hover |
| `--shadow-lg` | `0 18px 40px rgba(20,16,13,0.12)` | Modal |
| `--shadow-xl` | `0 30px 80px rgba(20,16,13,0.18)` | Sticky CTA |

Gölge cömertçe kullanılmaz; az ve belirgin.

---

## 6. Z-index katmanları

| Token | Değer | Katman |
|---|---|---|
| `--z-base` | 0 | İçerik |
| `--z-sticky` | 20 | Sticky header |
| `--z-dropdown` | 30 | Menü dropdown |
| `--z-overlay` | 40 | Cookie bar, toast |
| `--z-modal` | 50 | Modal backdrop + içerik |
| `--z-tooltip` | 60 | Tooltip |

Modal içinde form varsa tooltip modal z-index’inden **bir** üst basamaktadır.

---

## 7. Breakpoints

| Token | Değer | Anlam |
|---|---|---|
| `--bp-sm` | 480px | Büyük telefon |
| `--bp-md` | 768px | Tablet |
| `--bp-lg` | 1024px | Küçük laptop |
| `--bp-xl` | 1280px | Desktop |
| `--bp-2xl` | 1536px | Geniş desktop |
| `--bp-3xl` | 1920px | Full HD+ |

Mobil-öncelikli: varsayılan stil mobiledir, breakpoint’ler yukarı doğru uygulanır.

---

## 8. Container

| Token | Değer |
|---|---|
| `--container-sm` | 640px |
| `--container-md` | 768px |
| `--container-lg` | 1024px |
| `--container-xl` | 1200px |
| `--container-2xl` | 1360px |
| `--container-max` | 1440px |

Section kenar padding (container dışı):
- Mobile: `--space-4` (16px)
- Desktop: `--space-7` (40px)

---

## 9. Motion

| Token | Değer | Kullanım |
|---|---|---|
| `--duration-fast` | 150ms | Hover, küçük state |
| `--duration-base` | 280ms | Kart, button |
| `--duration-slow` | 480ms | Section entrance |
| `--duration-slower` | 800ms | Hero parallax/fade |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Varsayılan |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Simetrik geçiş |

**Reduced motion:** `prefers-reduced-motion: reduce` aktifse tüm büyük entrance animasyonları devre dışı; yalnızca küçük hover durumları kalır.

---

## 10. Grid

- **Desktop:** 12 sütun, 24px gutter, 1200–1440 içerik genişliği.
- **Tablet:** 8 sütun, 20px gutter.
- **Mobile:** 4 sütun, 16px gutter.
- **Baseline ritim:** 8px — dikey spacing 8’in katları tercih edilir.

---

## 11. Opacity

| Token | Değer |
|---|---|
| `--opacity-disabled` | 0.4 |
| `--opacity-soft` | 0.6 |
| `--opacity-watermark` | 0.08 |

---

## 12. Tailwind’e eşleme

`tailwind.config.ts` içinde `theme.extend` altından **yalnızca bu dosyadaki token’lar** verilir. Yeni bir renk/boyut gerekiyorsa önce buraya eklenir, sonra Tailwind config’e yansır. Tersi asla yapılmaz.
