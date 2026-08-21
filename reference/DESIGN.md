# Folkart Orion — Kapsamlı analiz ve yeniden üretim spesifikasyonu

**Kaynak sayfa:** https://folkart.com.tr/folkart-orion  
**Belge amacı:** Bu sayfanın (ve aynı şablonu kullanan Folkart proje sayfalarının) **DOM yapısı, sınıf adları, içerik, medya envanteri, üçüncü parti entegrasyonlar, formlar ve etkileşimler** dahil olmak üzere uçtan uca yeniden üretilmesi — özellikle **Claude / başka LLM** veya geliştirici ekibe verilecek tek referans belge.  
**Önemli:** Telifli marka, logo, fotoğraf ve metinleri **izinsiz kopyalamayın**; üretimde placeholder veya lisanslı varlıklar kullanın. Aşağıdaki URL ve dosya adları **davranış eşlemesi** içindir.

---

## 0. Bu belgenin kapsamı ve kullanımı

| Bölüm | Ne sağlar |
|--------|------------|
| §1–2 | Sayfa türü, hedef, dil, SEO |
| §3 | `<head>` içeriği (meta, link, base, kritik script sırası) |
| §4 | Üçüncü parti servisler (analitik, harita, reCAPTCHA, widget’lar) — **kendi anahtarlarınız** |
| §5 | Tasarım token’ları (renk, tipografi, bileşen kalıpları) |
| §6 | SVG sprite envanteri |
| §7 | Üst bilgi (header) — tam menü ağacı + **tam iç URL listesi** |
| §8 | Sayfa gövdesi — bölüm bölüm DOM özeti, sınıflar, içerik, medya |
| §9 | Galeri — 14 öğe, filtre anahtarları, dosya adları |
| §10 | Daire planları — tüm metrikler ve oda dökümü |
| §11 | Modallar, formlar, doğrulama, AJAX davranışı |
| §12 | Footer, çerez bandı, alt CTA |
| §13 | Harita `locations` dizisi (koordinat + etiket) |
| §14 | Bilinen tutarsızlıklar / hatalar (canonical, yazım, URL) |
| §15 | Uygulama checklist’i (pixel-perfect yaklaşım) |

**Base URL:** Sayfada `<base href="https://folkart.com.tr/">` vardır; göreli `href` değerleri bu köke göre çözülür.

---

## 1. Sayfa özeti

| Özellik | Değer |
|---------|--------|
| Şablon | Kurumsal proje detay / uzun tek sayfa (scroll) |
| `html` | `lang="tr"`, `itemscope`, `itemtype="http://schema.org/WebPage"` |
| Marka | Folkart — “Hayat Buna Değer” |
| Proje | Folkart Orion — karma kullanım (konut, ofis, otel, hastane perakende vb. bileşenler metinde) |
| Birincil dönüşüm | Telefon **444 22 78**, “Size Ulaşalım” formu, iletişim / çözüm merkezi sayfaları |

---

## 2. SEO ve sosyal meta (birebir metinler)

**`<title>`:**  
`Folkart Orion Projesi | Folkart - Folkart | Hayat Buna Değer`

**`meta name="description"`:**  
Folkart Orion, yaşamın tüm değerlerini birleştiren bir referans noktası. Rezidans, iş yaşamı, sağlık, otel, kültür, gastronomi ve sosyal yaşamın uyum içinde buluştuğu Orion’a, İzmir’in yeni merkezine hoş geldiniz.

**`meta name="robots"`:** `index, follow, noodp`  
**`meta name="keywords"`:** boş  
**`meta name="theme-color"`:** `#002e43` (iki kez tekrarlanmış)  
**`meta name="viewport"`:** `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`  
**`meta name="mobile-web-app-capable"`:** `yes`  
**`meta name="content-language"`:** `tr` (yinelenmiş)

**Open Graph / Twitter (özet):**

- `og:title` / `twitter:title`: `Folkart Orion Projesi | Folkart`
- `og:description` / `twitter:description`: description ile aynı uzun metin
- `og:image` / `twitter:image` / `itemprop="image"`: `upload/product/product_2026-02-23_14-43-18.png` (göreli)
- `og:url` / `twitter:url` / `itemprop="url"`: `https://folkart.com.tr/folkart-orion`
- `og:locale`: `tr`
- `og:site_name` / `twitter:site_name`: `Folkart | Hayat Buna Değer`
- `og:type`: `website`
- `twitter:card`: `summary`
- `twitter:creator` / `twitter:site`: `folkartyapi`

**Microdata:** `itemprop="name"` ve `itemprop="description"` yukarıdaki title/description ile uyumlu.

**Canonical (dikkat):**  
`link rel="canonical" href="https://folkart.com.tr/"` — **orion sayfası için ana sayfayı işaret ediyor**; SEO açısından hata olabilir. Klon üretirken Orion için `https://folkart.com.tr/folkart-orion` kullanılması mantıklıdır.

---

## 3. Head: stil, ikon, derlenmiş varlıklar

| Tür | Değer |
|-----|--------|
| Favicon | `assets/img/favicon.jpg` (`shortcut icon` + `icon`) |
| Ana CSS | `assets/css/style.min.css?v=0.0.0.6&display=swap` (`rel="stylesheet"` + `rel="preload"` birlikte) |
| intl-tel-input CSS | `https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css` |

**Head içi inline:**

- `div.wynona-powered-by { display: none !important; }` (OptinMonster / benzeri markayı gizleme)
- OptinMonster script: `https://a.omappapi.com/app/js/api.min.js` — `data-user="230367"` `data-account="246962"`

**Body öncesi / içi global değişken:**

```text
var BASE_URL = "https://folkart.com.tr/", LANG = "tr", LTR = "";
```

---

## 4. Üçüncü parti script ve servisler

Aşağıdaki kimlikler **örnek / tespit edilen değerlerdir**; kendi projenizde **yeniden oluşturun**, canlı siteden anahtar çalmayın.

| Servis | Gözlem |
|--------|--------|
| Facebook Pixel | `fbq('init', '1169981603466599')`, `fbevents.js` |
| Google Tag Manager | `GTM-NFF73TD2` |
| Google reCAPTCHA v3 | `api.js?render=6LeD0U8rAAAA...` — formlarda `execute(..., { action: 'contact' })` |
| Google Maps JS | `maps/api/js?key=...` — sayfa sonunda; `DOMContentLoaded` içinde `APP.map(locations)` |
| intl-tel-input | 17.0.8; `utils.js` CDN; `geoIpLookup` → `https://ipinfo.io/json` |
| MGID sensor | `mgsensor.js` host `a.mgid.com`, `cid: 828857` |
| Folkart AI satış widget | `ai-sales-agent.js` (Google Cloud Run tarzı hosted URL) |
| Parsley | Form doğrulama (jQuery ile) |
| Fancybox | `data-fancybox`, sınıf `fancybox` |
| Swiper | Çoklu `swiper-container` |
| AOS | `data-aos="fade-left|fade-right|fade-up"` |

**reCAPTCHA gizli alanlar (head script):**  
Token’lar `recaptchaResponse`, `recaptcha_response_2`, `recaptcha_response_3`, `recaptcha_response_4` id’li inputlara yazılacak şekilde tasarlanmış (sayfada hangi formların hangi id’yi kullandığı üretimde kontrol edilmeli).

---

## 5. Tasarım sistemi (token + bileşen kalıbı)

### 5.1 Sayfa / proje teması

- **CSS değişkeni (Orion sayfası):**  
  `:root { --t-color: 141, 124, 106; }`  
  → RGB `rgb(141, 124, 106)` ≈ **`#8d7c6a`** (taupe). `t--color`, `t--bg`, `t--btn-outline`, `t--theme` gibi yardımcı sınıflar bu değişkene bağlıdır.

- **Marka / chrome rengi:** `#002e43` (adres çubuğu tema rengi).

### 5.2 Konsept kartları (inline stiller)

| Öğe | Renk |
|-----|------|
| Kart arka planı | `#8d7c6a` |
| Ana başlık (`title-sub t--color`) | `#c1b567` |
| Gövde metni | `#cdcdcd` |
| Üst soyut / küçük satır | `#ffffff` |

### 5.3 Tipografi ve başlık hiyerarşisi

- Büyük bölüm başlıkları: `h2.opacity-2.display-2.bolder.uppercase` — çok büyük, kalın, tamamen büyük harf, düşük opaklıkla “arka planda watermark” etkisi.
- Alt başlık: `h3.title-sub.t--color` — çoğu yerde `<small>` ile iki satırlı kompozisyon (ör. “Hayatın” küçük, “Yeni Merkezi” büyük).
- `display-4` — “Tüm Projeler” CTA başlığında.

### 5.4 Layout ve grid

- Bootstrap benzeri: `container`, `row`, `no-gutters`, `col-lg-6`, `align-items-center`, `justify-content-between`, `text-md-right`, `order-md-*`, `d-none` / `d-lg-block` / `d-md-none` vb.
- `gutter-half`, `gutter-5`, `gutter-sm` — özel yatay boşluk.

### 5.5 Navigasyon chrome

- `header#header.header`
- `nav.navbar.navbar-dark.navbar-expand-xl`
- Logo: `navbar-brand` → `img.navbar-brand__logo` `assets/img/folkart_logo_black.svg`
- Sağ blok: `header-right` → `collapse.navbar-collapse#nvbrHeader`
- Alt menü: `ul.submenu` / `submenu-item` / `submenu-link` (İletişim, Çözüm Merkezi tekrarı)
- Dil: `main-lang` → `dropdown` — tetikleyici metin `tr`; öğeler `language?lang=en|ar|de`
- Arama: `search-body.collapse.js-autocomplete#searchMain` — `form` GET → `https://folkart.com.tr/search/result`, alan adı `search`, placeholder **“Detaylı Arama”**, `novalidate`
- Sosyal: `fixed-social` → `ul.social-menu` — SVG `use xlink:href="#icon-*"`
- `main-search` — arama aç/kapa; ikon search/close
- `lets-you` — “Bize Ulaşın”; `onclick="APP.fancy.open('#quickContact');"`
- Hamburger: `btn.navbar-toggler.btn-burger.hide-xl-up`

### 5.6 Medya kalıbı: blur-media

- `figure.blur-media` — çift katman: `blur-media__bg` (bulanık / büyük) + `blur-media__image` (ön plan)
- `picture.picture` — `source media="(min-width: 992px)"` veya `768px` ile farklı `srcset`
- Galeri / plan: `figcaption.opportunity-media__text`

### 5.7 Swiper kontrolleri

- Önceki/sonraki: `div.btn-swiper.swiper-button-prev|next`, `role="button"`, `aria-label="Önceki"` / `"Sonraki"`
- İç SVG: `#icon-arrow-left`, `#icon-arrow-right`
- Galeri altında: `swiper-pagination.h5.mb-0.t-first-color.d-md-none` (mobil sayfalama)
- Konsept: `div.concept-item__direction` içinde oklar

### 5.8 Buton sınıfları (örnekler)

- `btn.project-detail__button` + `btn-virtual-tour` | `btn-live-stream` | `btn-catalog` | `btn-info`
- `btn.btn-primary` / `btn-outline-primary` / `btn-secondary` / `btn-danger` (çerez)
- `btn-lg`, `btn-block`, `rounded-0` | `rounded-lg` | `rounded-xl`
- `link-border`, `link-border__left` — “Katalog İndir” / “Gönder” stili

### 5.9 Sabit yüzen öğeler

- `div.fixed-contact` — yalnız mesaj ikonları (quick contact açar)
- `div.fixed-social` — header içinde dikey sosyal

### 5.10 Hero’ya özel responsive katalog linkleri

Inline CSS sınıfları:

- `.asdasdasd { display:block; }` — masaüstü PDF butonu
- `.asdasdasd2 { display:none; }`
- `@media (max-width: 992px)` — tersine çevrilir: mobil katalog linki görünür

Masaüstü: `upload/media/folkart-orion_2026-04-10_06-29-56.pdf`  
Mobil: `https://folkart.com.tr/upload/projeler/folkart-orion-mobil-katalog.pdf`

---

## 6. SVG sprite (`<svg hidden>`) — sembol id listesi

| id | Kullanım |
|----|-----------|
| `icon-plus` | Genel UI |
| `icon-minus` | Genel UI |
| `icon-arrow-left` | Swiper geri |
| `icon-arrow-right` | Swiper ileri |
| `icon-home` | (rezerve) |
| `icon-search` | Arama, galeri overlay |
| `icon-close` | Arama kapat |
| `icon-mail` | İletişim |
| `icon-fax` | İletişim |
| `icon-phone` | Telefon |
| `icon-call` | Bize ulaşın animasyonu |
| `icon-message` | Bize ulaşın animasyonu |
| `icon-instagram` | Sosyal |
| `icon-youtube` | Sosyal |
| `icon-facebook` | Sosyal |
| `icon-twitter` | Sosyal (X logosu path) |
| `icon-google-plus` | (eski) |
| `icon-linkedin` | Sosyal |
| `icon-apple` | App Store butonu (footer’da gizli şablonda) |
| `icon-google-play` | Play butonu (footer’da gizli şablonda) |

Kullanım: `<svg class="icon icon-md|icon-lg|icon-4x ..."><use xlink:href="#icon-..."></use></svg>`

---

## 7. Header menü — tam ağaç ve URL’ler

Tüm **göreli** yollar `https://folkart.com.tr/` + yol ile tamamlanır.

### 7.1 Birinci seviye

| Etiket | href | Not |
|--------|------|-----|
| Logo | `https://folkart.com.tr/` | — |
| Projeler | `projeler` | dropdown |
| Arsalar | `tum-arsalar` | — |
| Kurumsal | `#` + `data-toggle="dropdown"` | — |
| Sürdürülebilirlik | `sürdürülebilirlik` + dropdown | **Dosya yolunda Türkçe karakter** (`sürdürülebilirlik`) |
| Önce İnsan | `folkartta-kariyer` + dropdown | — |
| Keşfet | `""` + dropdown | Boş href |
| Bize Ulaşın | `iletisim` + dropdown | — |

### 7.2 Dropdown içerikleri (metin → href)

**Projeler**

- Tüm Projeler → `projeler`

**Kurumsal**

- Hakkımızda → `hakkimizda`
- Başkanın Mesajı → `baskanin-mesaji`
- Değerlerimiz → `degerlerimiz`
- Etik İlkeler → `etik-ilkeler`
- Teknoloji → `teknoloji`
- Çözüm Ortaklarımız → `cozum-ortaklarimiz`
- Medya Merkezi → `medya-merkezi`
- Folkart Dergi → `dergi`
- Folkart Gallery → `folkart-galeri`
- Kişisel Verilerin Korunması Kanunu → `kisisel-verilerin-korunmasi-kanunu`
- Bilgi Toplumu Merkezi → `https://www.belgemodul.com/sirket/569` (`target="_blank"`)
- Satış Ortağı → `satis-ortagi`
- Gayrimenkul Yatırım Fonu → `gyf`

**Sürdürülebilirlik**

- Manifesto → `manifesto`
- Yaklaşım → `yaklasim`
- Üyeliklerimiz → `uyeliklerimiz`
- Sürdürülebilirlik Politikası → `surdurulebilirlik-politikasi`
- Sürdürülebilirlik Raporu → `surdurulebilirlik-raporu`
- İnsan Hakları Politikası → `insan-haklari-politikasi`
- Çeşitlilik, Eşitlik ve Kapsayıcılık Politikası → `cesitlilik-esitlik-ve-kapsayicilik-politikasi`
- İş Sağlığı ve Güvenliği → `is-sagligi-ve-guvenligii` (**üç tane “i”** — sitedeki yazım)
- Kalite ve Müşteri Memnuniyeti → `kalite-ve-musteri-memnuniyeti`
- Çevre Politikası → `cevre-politikasi`
- Bilgi Güvenliği Politikası → `bilgi-guvenligi-politikasi`
- Tedarik Zinciri Politikası → `tedarik-zinciri-politikasi`
- Sosyal Sorumluluk → `sosyal-sorumluluk`
- Kurumsal Hayırseverlik → `kurumsal-hayirseverlik`

**Önce İnsan**

- Folkart’ta Kariyer → `folkartta-kariyer`
- İK Politikamız → `ik-politikamiz`

**Keşfet**

- Türkiye’de Yatırım → `turkiye-de-yatirim`
- İzmir’i Keşfedin → `izmir-kesfet`
- Çeşme’yi Keşfedin → `cesme-yi-kesfet`

**Bize Ulaşın**

- İletişim → `iletisim`
- Çözüm Merkezi → `cozum-merkezi`

### 7.3 Submenu (yineleyen kısa linkler)

- İletişim → `iletisim`
- Çözüm Merkezi → `cozum-merkezi`

### 7.4 Dil seçici hatası

Ana dil linki: `href="javacript:;"` — **`javascript` yazım hatası** (`javacript`).

### 7.5 Sosyal tam URL’ler

- Facebook: `https://www.facebook.com/folkartyapi/`
- Instagram: `https://www.instagram.com/folkartyapi/`
- X/Twitter: `https://twitter.com/folkartyapi`
- YouTube: `https://www.youtube.com/user/folkartyapi`
- LinkedIn: `https://www.linkedin.com/company/folkart`

---

## 8. Sayfa gövdesi — bölüm sırası ve yapı

### 8.1 `fixed-contact`

- `a.lets-you__toggler` → `APP.fancy.open('#quickContact')`
- İkonlar: çift `icon-message` (header’daki gibi call/message dönüşümü yok)

### 8.2 Hero — `div.project-hero`

- Görsel: `div.project-hero__body` → `picture.picture`
  - `source media="(min-width: 768px)"` → `upload/product/product_2026-03-26_21-20-21.png`
  - Diğer → `upload/product/product_2026-02-23_14-35-421.png`
  - `img.slider-image` `loading="lazy"` `class="lazy"`
- Metin: `div.slider-body` → `div.container` → `div.slider-content` → `h1.slider-title`
  - **H1 içerik:** `İzmir'de Hayatın Yeni Merkezi` + `span` içinde `Folkart Orıon` + `<br />`  
  - Not: “Orion” yerine **“Orıon”** (Türkçe ı) kullanılmış; aynen kopyalanıp düzeltilebilir.
- `div.mouse-scroll__wrap` → `span.mouse-scroll` **`data-target="projectconcept"`** (tıklanınca veya script ile scroll)
- `div.project-detail__buttons`
  - `360° Sanal Tur` → `APP.fancy.open('#popup360')` — `btn-virtual-tour`
  - `Canlı Yayın` → `https://basturkelektronik.com/flash/player/yayin.php?stream=FFnrKr9e` — yeni sekme — `btn-live-stream`
  - `Kataloğu İncele` (desktop) → `upload/media/folkart-orion_2026-04-10_06-29-56.pdf` — `download` — `asdasdasd d-md-block`
  - `Kataloğu İncele` (mobil) → tam URL mobil PDF — `asdasdasd2`
  - `Size Ulaşalım` → quick contact — `btn-info`

### 8.3 Konsept — `div.block.block-concept.project-concept#projectconcept`

- Başlık: `h2.opacity-2.display-2.bolder.uppercase.px-3.px-lg-0` — **KONSEPT** (`data-aos="fade-left"`)
- `div.swiper-container` → `div.swiper-wrapper` — slaytlar `div.swiper-slide.concept-item__slide` (bazıları `is-bg`)

**Slayt 1 — video kapak**

- Medya: `concept-item__media` → `figure.blur-media` → `a.fancybox` `href="https://www.youtube.com/watch?v=IjQUubYiW4o?rel=0&autoplay=1"` `data-fancybox`
- Görsel: `upload/concept/concept_2026-03-13_12-47-34.png` + play overlay SVG
- Gövde: `concept-item__abstract` “Folkart Orion”; `h3` “Hayatın Yeni Merkezi”; paragraf bütüncül yaşam metni (bkz. önceki brief)

**Slayt 2 — Size**

- `picture`: desktop `concept_2026-03-13_12-48-00.jpg` (min-width 992px), mobil `concept_2026-02-24_09-28-401.jpg` — hem bg hem image katmanında aynı mantık
- Başlık: `<small>Size</small> Ait Bir Dünya` — Orion Residences + Concierge metni

**Slayt 3 — Doğaya**

- Görsel: `concept_2026-02-24_09-28-40.jpg` (992+) / `concept_2026-02-24_09-28-401.jpg`
- Başlık: `<small>Doğaya</small> Açılan Bir Yaşam` — Garden Residences metni

**Slayt 4 — Penthouse**

- Görsel: `concept_2026-02-24_10-40-49.jpg` / `concept_2026-02-24_10-40-491.jpg`
- Başlık: `<small>Ufkun Kesintisiz Uzandığı</small> Ayrıcalıklı Bir Dünya` — Penthouse metni

**Slayt 5 — İş**

- Görsel: `concept_2026-02-24_10-45-19.jpg` / `concept_2026-02-24_10-45-191.jpg`
- Başlık: `<small>İş Hayatına</small> Yeni Bir Perspektif` — Orion Business metni

**Slayt 6 — Suites**

- Görsel: `concept_2026-02-25_12-22-33.jpg` (992+) / fallback `concept_2026-02-24_10-45-191.jpg`
- Başlık: `<small>Seçkin Hizmet Anlayışıyla </small> Üst Düzey Yaşam` — Orion Suites metni

### 8.4 Lokasyon — `div.block.block-location`

- `div.row.no-gutters.bg-light`
- Sol: `inner-column` + **LOKASYON & MESAFELER** + `h3` Hayatın Yeni Merkezi + iki paragraf + `ul.list-unstyled` mesafe satırları (`d-flex justify-content-between`, `strong` sağda)
- Sağ: `div.project-map__image` → `img.img-fluid` `upload/product/product_2026-03-13_12-38-24.jpg`
- Inline style: `.project-map__image { height:100% }` `img { object-fit:cover; width:100%; height:100% }`

**Mesafe listesi (soldaki metin → sağdaki değer)**

1. İzmir Bölge Adliyesi — **150 m**
2. Stadyum Metro Durağı — **300 m**
3. Alsancak Limanı — **1.6 km**
4. Ege Üniversitesi — **3.3 m** (muhtemelen **km** hatası)
5. Kültürpark — **3.7 km**
6. Adnan Menderes Havalimanı — **30 km**

### 8.5 Galeri — `div.block.block-gallery.js-filter-gallery`

Üst: `container` — sol başlık **GALERİ**; sağ `select-custom-wrapper.project-select` — özel açılır menü:

- Tetikleyici: `span` **Tüm Görseller** + gizli `input` `name="project__filter"` `data-filter-type="input"` `data-filter="toggle"`
- Seçenekler (`data-value`):  
  - `*` → Tüm Görseller  
  - `dis-mekan-gorselleri`  
  - `ic-mekan-gorselleri`  
  - `sosyal-alan-gorselleri`

Her slayt: `div.swiper-slide.<kategori>` `data-filter="item"` → `a.fancybox` `data-fancybox="gallery"` → çift img + `figcaption` + `span.overlay` büyüteç.

Alt kontrol: `container.swiper-custom__buttons` — prev/next + mobil `swiper-pagination`.

### 8.6 Tam ekran özellik — `div.block.block-vh.align-items-stretch.block-project-feature`

- `picture.project-feature__media`: `product_2026-02-24_11-27-42.jpg` (992+) / `product_2026-02-24_11-27-421.jpg`
- Üst üste: `div.container.d-flex` → `div.project-feature.ml-auto`
  - Başlık/paragraf beyaz: 20.000 m² peyzaj, konut/ofis/otel/sosyal
  - `a.btn.btn-secondary.btn-block.btn-lg.rounded-0` **Proje Kataloğunu İndir** → `upload/media/folkart-orion_2026-04-10_06-29-56.pdf`

### 8.7 Sosyal olanaklar — `div.block.block-opportunity`

- `row.align-items-center`
- Sol `col-lg-6` — **SOSYAL** + satır kırılımı **OLANAKLAR** + paragraf + swiper okları `swiper-direction`
- Sağ `col-lg-6` — `div.swiper-container.slider-opportunity`

**Slayt sırası (HTML’deki):**

1. Mini Basketbol — `orion-basketbol-sahasi_2026-02-24_12-39-02.jpg`
2. Çocuk Oyun Alanı — `orion-cocuk-oyun-alani_2026-02-24_12-40-54.jpg`
3. Yüzme Havuzları — `orion-havuz_2026-02-24_12-43-09.jpg`
4. Gym & Fitness — `orion-fitness_2026-02-24_12-41-50.jpg`
5. Sauna — `orion-sauna_2026-02-24_12-44-19.jpg`
6. Kapalı Havuz — `orion-kapali-havuz_2026-02-24_12-45-03.jpg`

### 8.8 Vaziyet — `div.block-plan-stance.py-3.py-lg-4.t--bg`

- `div.plan-stance`
- Sol `plan-stance__media`: `figure.blur-media` — görsel `upload/product/product_2026-02-24_11-41-19.jpg` + `div.stance-numbers.t--color` içinde **7 adet** `div.stance-number` (içte `span` 01–07)

**Yüzde pozisyonlar (`style` — hotspot merkezi):**

| No | top | left | Etiket (swiper) |
|----|-----|------|------------------|
| 01 | 44.812% | 35.294% | Orion Residences |
| 02 | 37.304% | 49.081% | Orion Residences |
| 03 | 18.874% | 59.743% | Orion Suites |
| 04 | 33.891% | 63.419% | Medical Park Hospital |
| 05 | 57.440% | 77.757% | Orion Business |
| 06 | 79.283% | 50.919% | Orion Garden Residences |
| 07 | 88.157% | 40.257% | Orion Retail |

- Sağ `plan-stance__body`: masaüstünde **PROJE ÖZELLİKLERİ** (`d-none d-lg-block`), mobilde ayrı `h2` üstte
- `h3.plan-stance__title` — **Vaziyet** + **Planı**
- `div.swiper-container.slider-stance` — her slaytta `plan-stance__content` (içerik paragrafları **boş** `<p></p>`) + `plan-stance__bottom` numara ve `span` ile blok adı
- Swiper okları: `div.swiper-direction`

### 8.9 Daire planları — `div.block.block-room`

- `h3.title-sub` — **Daire** + **Planları**
- `row` → iki `col-lg-6`

**Sol sütun:** `swiper-container.block-room__main` — her slayt `div.plan-room`:

- `plan-room__head`: `plan-room__number` (tip adı) + `a.link-border.link-border__left` **Katalog İndir** → ilgili PDF
- Üç adet `div.btn.plan-room__btn.t--btn-outline`: NET / BRÜT / SATIŞA ESAS BRÜT (m² üst simge)
- `ul.plan-room__list` — oda satırları; inline CSS: `li:before{display:none}`

**Sağ sütun:** `swiper-container.block-room__media` — plan görseli `a.fancybox` `data-fancybox="plan"` + `data-caption`

İki swiper **senkron** ilerlemeli (referans JS’te `APP` veya Swiper thumbs/controller).

### 8.10 Alt iletişim — `div.bottom-contact.py-3.py-lg-4`

- Sol: **Size Ulaşalım** — `İletişim` → `iletisim-9`, `Çözüm Merkezi` → `cozum-merkezi`
- Sağ: online görüşme metni + `a.home-contact__phone` `tel:444 22 78`

### 8.11 Tüm projeler — `a.all-project.t--theme` `href="projeler"`

- `h2.display-4.all-project__title` — **Tüm Projeler**

---

## 9. Galeri dosya envanteri (tam liste)

Base: `https://folkart.com.tr/`  

**Dış mekan (6):**

1. `upload/media/orion-dis-mekan-1_2026-02-24_13-15-07.jpg`
2. `upload/media/orion-dis-mekan-_5_2026-02-24_13-19-18.jpg`
3. `upload/media/orion-dis-mekan_2_2026-02-24_13-15-41.jpg`
4. `upload/media/orion-dis-mekan_6_2026-02-24_13-19-42.jpg`
5. `upload/media/orion-dis-mekan_3_2026-02-24_13-17-49.jpg`
6. `upload/media/orion-dis-mekan_4_2026-02-24_13-18-39.jpg`

**İç mekan (4):**

1. `upload/media/orion-ic-mekan-1_2026-02-24_13-34-24.jpg`
2. `upload/media/orion-ic-mekan_2_2026-02-24_13-35-33.jpg`
3. `upload/media/orion-ic-mekan-_3_2026-02-24_13-35-56.jpg`
4. `upload/media/orion-ic-mekan-4_2026-02-24_13-36-16.jpg`

**Sosyal alan (4):**

1. `upload/media/sosyal-alan_1_2026-02-24_13-51-57.jpg`
2. `upload/media/sosyal-alan_2_2026-02-24_13-52-46.jpg`
3. `upload/media/sosyal-alan_3_2026-02-24_13-53-05.jpg`
4. `upload/media/sosyal-alanlar_4_2026-02-24_13-53-25.jpg`

**Toplam:** 14 slayt.

---

## 10. Daire tipleri — PDF, plan görseli, metrikler ve oda listeleri

### 10.1 PDF eşlemesi (`upload/files/`)

| Tip | Dosya |
|-----|--------|
| 1+1 | `plan_2026-04-10_06-34-30.pdf` |
| 2+1 | `plan_2026-04-10_06-38-41.pdf` |
| 3+1 | `plan_2026-04-10_06-44-43.pdf` |
| 3+1 Dubleks | `plan_2026-04-10_06-32-05.pdf` |
| 4+1 | `plan_2026-04-10_07-08-23.pdf` |
| 5+1 Dubleks | `plan_2026-04-10_07-10-23.pdf` |
| 6+1 Penthouse | `plan_2026-04-10_07-12-29.pdf` |

### 10.2 Plan görseli eşlemesi (`upload/plan/`)

| Tip | Görsel |
|-----|--------|
| 1+1 | `plan_2026-02-24_15-10-21.jpg` |
| 2+1 | `plan_2026-02-24_14-45-31.jpg` |
| 3+1 | `plan_2026-02-24_14-58-25.jpg` |
| 3+1 Dubleks | `plan_2026-04-10_08-33-59.png` |
| 4+1 | `plan_2026-02-24_15-05-18.jpg` |
| 5+1 Dubleks | `plan_2026-04-10_08-40-27.png` |
| 6+1 Penthouse | `plan_2026-04-10_14-02-50.png` |

### 10.3 Metrik ve oda dökümü

**1+1** — Net **38.21** | Brüt **74.80** | Satışa esas brüt **52.31** m²  

| # | Alan | m² |
|---|------|-----|
| 1 | Giriş Holü | 4.57 |
| 2 | Salon+ Mutfak | 16.72 |
| 3 | Yatak Odası | 12.48 |
| 4 | Banyo | 4.44 |
| 5 | Balkon | 5.52 |

**2+1** — Net **66.40** | Brüt **131.27** | Satışa esas **91.80**  

| # | Alan | m² |
|---|------|-----|
| 1 | Giriş Holü | 4.18 |
| 2 | Salon+ Mutfak | 21.17 |
| 3 | E. Yatak Odası | 20.50 |
| 4 | Banyo | 4.42 |
| 5 | Yatak Odası | 10.90 |
| 6 | Hol | 4.14 |
| 7 | Çamaşır Odası | 1.09 |
| 8 | Balkon | 10.95 |

**3+1** — Net **101.53** | Brüt **202.83** | Satışa esas **141.84**  

| # | Alan | m² |
|---|------|-----|
| 1 | Giriş Holü | 6.15 |
| 2 | Salon+ Mutfak | 38.78 |
| 3 | E. Yatak Odası | 17.08 |
| 4 | E. Banyo | 3.70 |
| 5 | Yatak Odası | 11.73 |
| 6 | Yatak Odası | 11.97 |
| 7 | Hol | 6.19 |
| 8 | Banyo | 4.34 |
| 9 | Çamaşır Odası | 1.59 |
| 10 | Balkon | 18.18 |

**3+1 Dubleks** — Net **126.39** | Brüt **296.14** | Satışa esas **221.78**  

| # | Alan | m² |
|---|------|-----|
| 1 | Giriş Holü | 5.23 |
| 2 | Salon | 36.17 |
| 3 | Mutfak | 11.02 |
| 4 | Wc | 2.65 |
| 5 | Vestiyer | 5.48 |
| 6 | Hol | 3.42 |
| 7 | Kış Bahçesi | 12.05 |
| 8 | Teras | 15.04 |
| 9 | Bahçe | 31.50 |
| 10 | E. Yatak Odası | 20.14 |
| 11 | E. Banyo | 4.50 |
| 12 | Yatak Odası | 12.13 |
| 13 | Yatak Odası | 14.33 |
| 14 | Banyo | 5.07 |
| 15 | Çamaşır Odası | 1.88 |
| 16 | Hol | 4.37 |

**4+1** — Net **177.03** | Brüt **457.51** | Satışa esas **307.59**  

| # | Alan | m² |
|---|------|-----|
| 1 | Giriş Holü | 18.43 |
| 2 | Salon | 51.12 |
| 3 | Mutfak | 18.72 |
| 4 | E.Yatak Odası | 26.22 |
| 5 | E. Banyo | 4.47 |
| 6 | Yatak Odası | 12.67 |
| 7 | Yatak Odası | 12.67 |
| 8 | Yatak Odası | 10.32 |
| 9 | Banyo | 3.55 |
| 10 | Çamaşır Odası | 1.84 |
| 11 | Banyo | 4.00 |
| 12 | Hol | 10.21 |
| 13 | Wc | 2.81 |
| 14 | Balkon | 5.00 |
| 15 | Balkon | 31.22 |
| 16 | Teras | 56.03 |

**5+1 Dubleks** — Net **174.22** | Brüt **353.41** | Satışa esas **247.14**  

| # | Alan | m² |
|---|------|-----|
| 1 | Giriş Holü | 4.14 |
| 2 | Salon | 40.24 |
| 3 | Yemek Odası | 14.12 |
| 4 | Mutfak | 26.72 |
| 5 | Wc | 2.72 |
| 6 | Vestiyer | 1.24 |
| 7 | Hol | 10.81 |
| 8 | Balkon | 23.72 |
| 9 | E. Yatak Odası | 18.00 |
| 10 | E.Banyo | 3.35 |
| 11 | Yatak Odası 1 | 12.20 |
| 12 | Yatak Odası 2 | 11.76 |
| 13 | Yatak Odası 3 | 12.37 |
| 14 | Banyo | 5.45 |
| 15 | Çamaşır Odası | 1.64 |
| 16 | Hol | 9.96 |

**6+1 Penthouse** — Net **317.60** | Brüt **1109.14** | Satışa esas **584.34**  

| # | Alan | m² |
|---|------|-----|
| 1 | Giriş Holü | 8.26 |
| 2 | Salon | 40.27 |
| 3 | Yemek Odası | 37.93 |
| 4 | Mutfak | 31.70 |
| 5 | Banyo 1 | 5.43 |
| 6 | Hobi Odası | 11.29 |
| 7 | Hol 1 | 16.693 |
| 8 | Balkon | 10.03 |
| 9 | E. Yatak Odası | 33.73 |
| 10 | E.Banyo | 3.61 |
| 11 | Yatak Odası 1 | 27.21 |
| 12 | Banyo 2 | 3.77 |
| 13 | Yatak Odası 2 | 11.57 |
| 14 | Yatak Odası 3 | 31.89 |
| 15 | Banyo 3 | 4.93 |
| 16 | Banyo 4 | 5.36 |
| 17 | Hol 2 | 9.11 |
| 18 | Hol 3 | 16.94 |
| 19 | Tahsisli Alan | 123.09 |
| 20 | Havuz Makine Dairesi | 36.56 |
| 21 | Çamaşır Odası | 6.86 |
| 22 | Merdiven | 10.81 |
| 23 | Teras | 123.10 |

Not: Sitede bazı `m<sup>2</sup>` işaretlemelerinde boşluk tutarsızlığı vardır (ör. “10.03 m 2”); veri aynıdır.

---

## 11. Modallar ve formlar

### 11.1 360° — `div#popup360.popup-modal.popup-360` (`display:none`)

- `h3.popup-360__title` — **360° Sanal Tur**
- Grid butonlar `btn.btn-outline-primary.btn-block.btn-lg.rounded-0` `target="_blank"` `rel="nofollow"`:
  - 1+1 → `https://my.matterport.com/show/?m=eEa1YWoLYbe`
  - 2+1 → `https://my.matterport.com/show/?m=f7Cr2AGb1sN`
  - 3+1 → `https://my.matterport.com/show/?m=aih6NDv6TSo`

### 11.2 Quick contact — `div#quickContact.popup-modal.quick-contact`

- `h4` — **Size Ulaşalım**
- `p.quick-contact__text` — ayrıcalık metni
- `form#footer_form` — `action="contact/form"` `method="post"` `autocomplete="off"`
  - `input type="hidden" name="form" value="Size Ulaşalım"`
  - `input type="hidden" name="recaptcha_response_2" id="recaptcha_response_2"`
  - Ad: `input name="asdfg1"` `class="fullname"` `required` — Parsley mesajı: “Lütfen ad ve soyad giriniz”
  - Proje: `select name="project"` `required` — “Lütfen proje seçiniz”; varsayılan seçili `option value="FLKKNK"` Folkart Orion
  - E-posta: `input name="asdfg2"` `type="email"` `required`
  - Telefon: gizli `phonecode` id `phonecode3` + `input#phonenumber3` `name="phonenumber"` `class="mask"` `required`
  - Mesaj: `textarea name="message"` (placeholder “Mesajınız”; required mesajı attribute’da tanımlı ama boş bırakılabilir davranış — üretimde kontrol)
  - KVKK: `checkbox name="kvkk" id="quickContactKvkk"` zorunlu; label link `kisisel-verilerin-korunmasi-kanunu`
  - Kampanya: `checkbox name="campaing"` (yazım **campaing**) `id="quickContactCampaing"`
  - Gönder: `button.btn.link-border.btn-send` — tıklanınca jQuery ile `e.preventDefault()`, Parsley, sonra `$.ajax` POST; başarıda Fancybox kapanır veya modal; metin **GÖNDERİLİYOR...**

**Proje kodları (`value` → görünen ad):**

| Kod | Ad |
|-----|-----|
| FLKARSA | Folkart Arsa Dikili |
| FLKBYRZ | Folkart Boyalık Çeşme |
| FLKCSMHLS | Folkart Hills Çeşme |
| FLKEGP | Folkart Mona Mavişehir |
| FLKHDMK | Folkart Nefes İstanbul |
| FLKNVA | Folkart Nova |
| FLKKNK | Folkart Orion (selected) |
| FLKREIS | Folkart Terra Çeşme |
| FLKTCRALN | Folkart Ticari Alanlar |
| FLKGYF | Folkart GYF |

**Sağ sütun:** “Online Randevu Almak İçin:” + `tel:444 22 78` + İletişim / Çözüm Merkezi butonları (`rounded-xl`).

**WhatsApp / AI arama:**  
`var whatsappProjects = ["FLKKNK","FLKREIS","FLKEGP","FLKNVA"];` — form başarılı ve proje bu listedeyse `triggerAICall` vb. çağrılabilir (Orion listede).

### 11.3 Telefon doğrulama mantığı (özet)

- intl-tel-input: `initialCountry: "auto"`, `separateDialCode: true`, `preferredCountries: ['tr','az','de']`
- Ülke kodu gizli alana yazılır
- TR için maske: placeholder rakamları `X` ile; `inputmask` ile uyum
- Özel kurallar: `0` ile başlamamalı; “5 ile başlayarak” uyarı mesajları Parsley `customError` ile

### 11.4 AJAX başarı modalı (dinamik)

Bootstrap modal oluşturulur: başarı → “TEŞEKKÜRLER”, uyarı → “UYARI”, hata → “HATA”; `z-index` 999999.

---

## 12. Footer ve çerez

### 12.1 Footer — `footer.footer.py-3.py-lg-4`

- Satır 1: sol `col-md-6 d-none` içinde (çoğu gizli) Folkart tanıtım kataloğu PDF `upload/media/files_2021-05-04_11-13-04.pdf`, Play / App linkleri (şablonda `d-none`)
- Sağ: `social-menu` (header ile aynı 5 link)
- Satır 2 `footer-bottom`: Saya Holding logosu `upload/saya-holding.png` → `https://www.sayaholding.com` + küçük metin “Folkart bir Saya Holding kuruluşudur.”
- Copyright satırı: MMG logo `upload/u-logo.jpg` + “Copyright 2021 © Folkart. Tüm Hakları Saklıdır.”

### 12.2 Çerez — `div.cookie`

- Metin linki: `kisisel-verilerin-korunmasi-kanunu` — çerez + KVKK
- Buton: `btn.btn-danger.btn-block.btn-cookie` — **Anladım**

---

## 13. Harita: `locations` JavaScript dizisi

Sayfa script’inde (UTF-8 doğru okunursa Türkçe karakterler düzgündür):

```js
var locations = [
  ['Folkart Orion', 38.44607710167283, 27.176745060260707, ''],
  ['İzmir Bölge Adliyesi', 38.44380255680823, 27.17867839660335, '150 m'],
  ['Stadyum Metro Durağı', 38.443245719867924, 27.180608523854918, '300 m'],
  ['Alsancak Limanı ', 38.43897946104779, 27.141272112218772, '1.6 km'],
  ['Ege Üniversitesi', 38.45668318632462, 27.22819273218561, '3.3 m'],
  ['Kültürpark', 38.457522262931846, 27.145345074580742, '3.7 km'],
  ['Adnan Menderes Havalimanı ', 38.29214877114292, 27.148875404289655, '30 km']
];
```

`DOMContentLoaded`: `if(locations) { APP.map(locations); }`

---

## 14. Bilinen tutarsızlıklar ve üretim notları

1. **Canonical** ana sayfayı gösteriyor; Orion için düzeltilmeli.  
2. **H1 “Orıon”** — marka yazımı kontrolü.  
3. **Ege Üniversitesi 3.3 m** — büyük ihtimalle km.  
4. **Dil linki `javacript:`** — kırık.  
5. **Sürdürülebilirlik menü URL’si** dosya sisteminde `sürdürülebilirlik` (Unicode).  
6. **İş Sağlığı URL** `is-sagligi-ve-guvenligii` fazla “i”.  
7. **Hero H1 kapanış etiketi** kaynakta hatalı olabilir (`</h1>` eksik/yanlış); tarayıcı düzeltir; üretimde geçerli HTML kullanın.  
8. **Gizli yorum** HTML içinde Google API anahtarı izi — asla üretim reposuna taşımayın.  
9. **`user-scalable=no`** erişilebilirlik açısından zayıf; modern sitede kaldırılabilir.

---

## 15. Uygulama checklist’i (detaylı)

- [ ] `base` + göreli URL çözümlemesi veya tam URL’ye refactor  
- [ ] Header xl breakpoint, dropdown’lar, arama collapse, dil menüsü  
- [ ] Tema rengi `--t-color` ve `t--*` yardımcıları  
- [ ] Hero picture 768px kırılımı + lazy load  
- [ ] Katalog responsive iki PDF yolu  
- [ ] Konsept Swiper + Fancybox video  
- [ ] Lokasyon iki sütun + harita görseli object-fit  
- [ ] Galeri: özel select filtre + Swiper + Fancybox grubu  
- [ ] Özellik bandı full-bleed picture 992px  
- [ ] Sosyal olanaklar çift sütun + Swiper  
- [ ] Vaziyet: 7 hotspot yüzde pozisyon + senkron metin swiper  
- [ ] Daire: çift senkron swiper + 7 tip + PDF + fancybox plan  
- [ ] Quick contact Fancybox modal + Parsley + AJAX + reCAPTCHA  
- [ ] 360 modal + Matterport  
- [ ] Footer + çerez  
- [ ] `APP.map(locations)` veya eşdeğeri  
- [ ] AOS `data-aos` attribute’ları  
- [ ] Performans: CSS/JS sürüm query string’leri (`?v=`) cache busting  

---

## 16. Kaynak ve analiz yöntemi

Bu spesifikasyon, **folkart.com.tr/folkart-orion** sayfasının kaynak HTML çıktısının parse edilmesiyle (tüm `href`/`src`, meta, blok sınıfları, formlar, `locations` dizisi, stance yüzdeleri) ve sayfa hiyerarşisinin manuel doğrulanmasıyla üretilmiştir. Canlı site güncellenirse önce HTML diff alınmalıdır.

---

*Son güncelleme bağlamı: analiz, workspace’te saklanan sayfa dökümü üzerinden yapılmıştır.*
