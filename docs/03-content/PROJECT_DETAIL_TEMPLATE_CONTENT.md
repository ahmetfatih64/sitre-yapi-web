# PROJECT_DETAIL_TEMPLATE_CONTENT — Proje detay şablonu içerik rehberi

Bu dosya sitenin **en kritik** şablonunun içerik sözleşmesidir. Referans tasarımın section ritmi, Sitre Yapı’nın premium diline uyarlanmıştır. Her proje bu şablona **aynı section sırasıyla** oturur; section atlanabilir ancak yeri değişmez.

> İçerik modeli ve alanların kesin tip tanımı: [docs/06-engineering/CONTENT_SCHEMA.md](../06-engineering/CONTENT_SCHEMA.md) → `project`. Bu dosya içeriğin **editoryal** şablonudur, kod şeması değil.

---

## 0. Genel prensipler

- Her section **kısa ve net** bir başlık + **gerektiği kadar** metin içerir.
- Tek section = tek fikir. Birden fazla mesaj bindirilmez.
- Metin olmadığı zaman section boş kalmaz — tamamen gizlenir. Boş başlık bırakılmaz.
- CTA dili: [BRAND_VOICE.md](../01-brand/BRAND_VOICE.md) §5.1. Birincil CTA her zaman **quick-contact modal** tetikler.
- Görseller `next/image` ile; her görselde alt metin zorunlu. Alt metin “proje adı + içerik” formatında: örn. “Sitre [X] — hol ve merdiven detayı”.

---

## 1. Section listesi (sıralı)

1. Hero
2. Konsept (mimari fikir)
3. Lokasyon
4. Feature band (özellik şeridi)
5. Galeri
6. Sosyal olanaklar
7. Vaziyet planı
8. Daire / plan tipleri
9. 360° modal (opsiyonel)
10. Quick contact modal (floating)
11. Alt CTA band
12. Footer (global)

---

## 2. Section 1 — Hero

**Amaç:** İlk 3 saniyede projenin karakterini kurmak ve birincil CTA’yı net etmek.

**İçerik alanları:**
- `hero.mediaType` — `image` | `video`
- `hero.media` — büyük görsel veya video (16:9 veya 21:9, mobilde portrait crop)
- `hero.overline` — üst satır, küçük uppercase, örn: “Yeni proje”
- `hero.title` — proje adı (h1)
- `hero.subtitle` — tek cümle mimari vaat, örn: “Arazinin dilini dinleyen bir konut fikri.”
- `hero.location` — lokasyon etiketi, örn: “İzmir — Urla”
- `hero.status` — “Aktif satış” / “Yakında” / “Tamamlandı”
- `hero.primaryCta` — her zaman quick-contact modal tetikler, label: **“Size ulaşalım”**
- `hero.secondaryCta` — (opsiyonel) “Galeriye git” (aynı sayfa anchor)

**Editoryal kurallar:**
- Subtitle 10–14 kelime.
- Overline 1–3 kelime.
- Hero’da fiyat / metrekare yazılmaz.

---

## 3. Section 2 — Konsept

**Amaç:** Projenin mimari fikrini ve onu farklılaştıran kararları anlatmak.

**İçerik alanları:**
- `concept.overline` — “Mimari fikir”
- `concept.title` — kısa iddia, örn: “Arazinin topoğrafyasına saygı duyan bir kütle.”
- `concept.body` — 2–4 paragraf, toplam 120–220 kelime
- `concept.highlights[]` — 3 madde, her biri 5–10 kelime (örn. “Doğal ışık akışı”, “Özenli malzeme seçimi”, “Peyzajla bütünleşik cephe”)
- `concept.image` — tek büyük mimari fotoğraf (4:3 veya 3:2)

**Editoryal kurallar:**
- “Lüks”, “eşsiz”, “muhteşem” kelimeleri yok.
- Mimari fikir somut bir kararla anlatılır (kütle, yönelim, boşluk, cephe, peyzaj).

---

## 4. Section 3 — Lokasyon

**Amaç:** Projenin bulunduğu yerin değerini ve yaşam bağlamını göstermek.

**İçerik alanları:**
- `location.overline` — “Lokasyon”
- `location.title` — kısa iddia, örn: “Şehre yakın, doğaya yaslı.”
- `location.address` — açık adres
- `location.coordinates` — `{ lat, lng }`
- `location.body` — 1–2 paragraf, bölge karakteri
- `location.nearby[]` — yakındaki noktalar, her biri `{ name, category, distance }`, 5–10 öğe
  - Kategoriler: okul, sağlık, alışveriş, ulaşım, sosyal, doğa
- `location.mapEmbed` — interaktif harita bileşeni

**Editoryal kurallar:**
- “Merkezi konum” gibi belirsiz ifadeler yerine sayılar: “10 dk ile marina, 20 dk ile havalimanı”.
- Yanıltıcı mesafe yok.

---

## 5. Section 4 — Feature band (özellik şeridi)

**Amaç:** Projeyi tanımlayan temel sayıları tek bakışta sunmak.

**İçerik alanları:**
- `features[]` — 4–6 öğe, her biri `{ label, value, icon? }`
  - Örn:
    - `Blok sayısı — 3`
    - `Daire sayısı — 84`
    - `Teslim — 2027 Q4`
    - `Yeşil alan oranı — %62`
    - `Otopark — kapalı`
    - `Konut tipi — konut + residence`

**Editoryal kurallar:**
- Değerler kısa; açıklama satırı yok.
- İkon opsiyonel; tutarsız ikon kullanılacaksa hiç kullanılmaz.

---

## 6. Section 5 — Galeri

**Amaç:** Projenin fotoğraflarını ve render’larını kategorili, rahat bir şekilde sunmak.

**İçerik alanları:**
- `gallery.overline` — “Galeri”
- `gallery.title` — örn: “Mekanları keşfedin.”
- `gallery.items[]` — her biri `{ id, src, alt, category, caption? }`
- `gallery.categories[]` — filtre kategorileri (örn: Dış, İç, Peyzaj, Render)

**Davranış:**
- Grid veya masonry, kategori filtresi.
- Görsel tıklanınca lightbox / fullscreen açılır (swiper/fancybox benzeri).
- Mobilde filtre chip’leri yatay kaydırılır.

**Editoryal kurallar:**
- Her görselde alt metin zorunlu.
- Watermark yok.
- En az 8, en fazla 40 görsel (mobil performans için).

---

## 7. Section 6 — Sosyal olanaklar

**Amaç:** Projenin “yaşam deneyimi” boyutunu somutlamak.

**İçerik alanları:**
- `amenities.overline` — “Sosyal olanaklar”
- `amenities.title` — örn: “Her gün, her hafta, her mevsim için.”
- `amenities.items[]` — her biri `{ icon, name, description? }`
- `amenities.image` — (opsiyonel) destek görseli

**Davranış:**
- Desktop: grid (3–4 sütun)
- Mobile: yatay slider (swiper)

**Editoryal kurallar:**
- İsim tek kelime veya kısa tamlama: “Yüzme havuzu”, “Fitness”, “Çocuk oyun alanı”, “SPA”, “Ortak çalışma alanı”, “Peyzaj yürüyüş yolu”.
- Açıklama 1 cümle, abartısız.

---

## 8. Section 7 — Vaziyet planı

**Amaç:** Yerleşimin okunabilir bir üst görünüm ile sunulması.

**İçerik alanları:**
- `siteplan.overline` — “Vaziyet planı”
- `siteplan.title` — örn: “Yerleşim.”
- `siteplan.image` — büyük görsel (SVG tercih edilir, zoom için)
- `siteplan.hotspots[]` — (opsiyonel) her biri `{ id, x%, y%, label, targetBlockId? }`

**Davranış:**
- Desktop: tıklanabilir hotspot’lar → blok bilgisi veya plan tipine scroll.
- Mobile: pinch-zoom destekli görsel, hotspot dokunma hedefleri ≥ 44px.

**Editoryal kurallar:**
- Hotspot’lar net ve az — görseli karartmaz.
- “Kuzey” yönü veya ölçek çubuğu yardımcı grafik olarak eklenebilir.

---

## 9. Section 8 — Daire / plan tipleri

**Amaç:** Alıcının kendi senaryosunu görmesi: “ben hangi daireyi alırım?”

**İçerik alanları:**
- `plans.overline` — “Plan tipleri”
- `plans.title` — örn: “Daireyi seçin.”
- `plans.categories[]` — örn: `["1+1", "2+1", "3+1", "4+1", "Dubleks"]`
- `plans.items[]` — her biri:
  - `category` — yukarıdaki kategorilerden
  - `code` — örn: “A-Tipi”
  - `image` — plan görseli (SVG tercih)
  - `totalArea` — toplam m²
  - `netArea` — net m²
  - `rooms[]` — `{ name, area }` (örn: salon, yatak odası 1, banyo, balkon)
  - `orientation` — cephe yönü
  - `floorRange` — kat aralığı (örn: “2–8. kat”)

**Davranış:**
- Kategori sekmesi → slider.
- Her karttan “Bu plan için bilgi al” CTA’sı quick-contact modalını **o plan seçili** açar.

**Editoryal kurallar:**
- Tablo okunabilir, cm² değil m².
- Fiyat yazılmaz.

---

## 10. Section 9 — 360° modal (opsiyonel)

**Amaç:** Varsa, sanal tur deneyimini saklamadan sunmak.

**İçerik alanları:**
- `tour.available` — boolean
- `tour.embedUrl` — üçüncü parti tur servisinin URL’i
- `tour.ctaLabel` — “360° turu başlat”

**Davranış:**
- Modal tam ekran açılır.
- Escape ile kapanır, focus iade edilir.
- Mobilde body scroll kilidi + safe-area inset.

**Editoryal kurallar:**
- İçerik yoksa bu section tamamen gizlenir.

---

## 11. Section 10 — Quick contact modal

**Amaç:** Her noktadan tek tık uzaklıkta lead yakalama.

**İçerik alanları:**
- `quickContact.title` — “Size ulaşalım”
- `quickContact.description` — 1 cümle: “Formu iletin, kısa sürede geri dönelim.”
- Form alanları:
  - Ad Soyad *
  - Telefon *
  - E-posta *
  - İlgilendiğiniz plan tipi (proje detayında dolu gelir, değiştirilebilir)
  - Mesaj (opsiyonel)
  - KVKK onayı *
- Submit label: **“Gönder”**
- Success state: “Teşekkür ederiz. En kısa sürede size ulaşacağız.”

**Davranış ve validation:** [FORMS_AND_MODAL_SPEC.md](../04-design/FORMS_AND_MODAL_SPEC.md)

---

## 12. Section 11 — Alt CTA band

**Amaç:** Scroll sonunda kullanıcıyı adımı atmaya davet etmek.

**İçerik alanları:**
- `bottomCta.title` — örn: “Projeyi yerinde görmek ister misiniz?”
- `bottomCta.description` — 1 cümle davet
- `bottomCta.primaryCta` — **“Randevu oluştur”** (quick-contact)
- `bottomCta.secondaryCta` — **“Diğer projelerimiz”** → `/projeler`

**Editoryal kurallar:**
- Zorlayıcı dil yok.
- Arka plan büyük, sade bir mimari fotoğraf veya düz marka rengi.

---

## 13. Genel meta (section değil ama gerekli)

- `meta.title` — `Sitre Yapı | [Proje Adı] — [Lokasyon]`
- `meta.description` — 150–160 karakter, davet dilinde
- `meta.ogImage` — 1200×630, hero’dan farklı olabilir
- `meta.canonical` — `/projeler/[slug]`
- JSON-LD: [METADATA_AND_SCHEMA.md](../05-seo/METADATA_AND_SCHEMA.md) → `RealEstateListing`

---

## 14. Editoryal checklist (kabul)

- [ ] Hero subtitle 10–14 kelime aralığında
- [ ] Konsept 2–4 paragraf
- [ ] Lokasyon yakın noktalar 5–10 öğe
- [ ] Feature band 4–6 madde
- [ ] Galeri 8–40 görsel, her birinde alt metin
- [ ] Sosyal olanaklar 6+ madde, tutarlı ikon seti
- [ ] Vaziyet planı büyük görsel ve (opsiyonel) hotspot
- [ ] Plan tipleri en az 3 kategori, her kategoride en az 1 plan
- [ ] Tüm section başlıkları kırmızı-liste kelime içermiyor
- [ ] Hiçbir section’da fiyat geçmiyor
- [ ] Quick contact modal her CTA’dan açılıyor
- [ ] Alt CTA band rahatlıkla ikinci bir adım sunuyor
- [ ] Meta title, description, og image dolu
