# PAGE_INVENTORY — Sayfa envanteri

Her sayfanın **amacı, section listesi, CTA’sı, veri ihtiyacı**. İçerik metinleri için [docs/03-content/](../03-content/). Section sırası, tasarım şablonunun ritim kurallarına göre bağlayıcıdır — keyfi değişmez.

---

## `/` — Ana sayfa

**Amaç:** Markanın ilk izlenimini vermek, öne çıkan projelere yönlendirmek, güven sinyalleri toplamak, iletişime davet etmek.

**Section listesi (sıralı):**
1. **Hero** — mimari büyük görsel/video, marka tek cümlesi, birincil CTA (“Projeleri keşfet”)
2. **Marka vaadi / introduction** — 1–2 paragraf, mimari dil kısa giriş
3. **Öne çıkan projeler** — 3–6 proje kartı, slider veya grid
4. **Hizmetler özeti** — 3–4 kart (proje geliştirme, mimari, taahhüt, danışmanlık)
5. **Kurumsal özet** — yıllar, teslim edilmiş projeler, (opsiyonel) kısa hikaye + “Hakkımızda” CTA
6. **İletişim bandı / CTA band** — “Size ulaşalım” teması, quick-contact butonu
7. **Footer**

**Birincil CTA:** Projeleri keşfet (hero) + Size ulaşalım (band)
**Veri ihtiyacı:** featured-projects listesi, hizmet kartları, kurumsal sayılar

---

## `/hakkimizda`

**Amaç:** Kurum hikayesi, mimari yaklaşım, değerler, süreç ve ekip özeti ile güven inşa etmek.

**Section listesi:**
1. **Hero** — sade, başlık + kısa kurum cümlesi
2. **Hikaye** — kısa paragraf + 1 mimari fotoğraf
3. **Değerler** — 4–5 kart (özen, süreklilik, şeffaflık, mimari saygı, sadelik)
4. **Yaklaşım / süreç** — 3–5 adım timeline veya numaralı liste (fikir → tasarım → inşaat → teslim → sonrası)
5. **Sayılar / öne çıkan veriler** — (opsiyonel) yıl, proje sayısı, teslim edilen m²
6. **Ekip özeti** — (opsiyonel, içerik varsa) kilit isimler
7. **CTA band** — “Projelerimizi inceleyin” + “İletişim”
8. **Footer**

**Birincil CTA:** Projeleri gör
**Veri ihtiyacı:** kurumsal metin, değerler listesi, süreç adımları, (opsiyonel) ekip listesi, sayılar

---

## `/projeler`

**Amaç:** Tüm projeleri filtreleyerek sunmak; her karttan detay sayfasına götürmek.

**Section listesi:**
1. **Başlık bloğu** — kısa açıklama + filtreler
2. **Filtre barı** — durum (aktif / tamamlanan / yakında), (opsiyonel) lokasyon
3. **Proje grid** — responsive kart grid, her kart: görsel, ad, lokasyon, durum rozeti, kısa özet, “Detaylar” linki
4. **Boş state** — filtre sonucu yoksa
5. **CTA band** — “Özel talepleriniz için bize ulaşın”
6. **Footer**

**Birincil CTA:** Proje detayına git
**Veri ihtiyacı:** tüm projelerin meta listesi (slug, ad, lokasyon, durum, kapak görseli, kısa özet)

---

## `/projeler/[slug]` — Proje detay şablonu

**Amaç:** Tek bir projeyi derinlemesine anlatmak, güven ve arzu inşa etmek, quick-contact ile lead yakalamak.

**Section listesi (referans ritmine göre):**
1. **Hero** — büyük görsel/video, proje adı, konum, kısa açıklama, birincil CTA (quick-contact aç)
2. **Konsept** — mimari fikir, arazi/lokasyon yorumu, 1–2 büyük görsel
3. **Lokasyon** — harita + yakındaki noktalar, ulaşım bilgisi
4. **Feature band** — 4–6 özellik (daire sayısı, blok sayısı, teslim tarihi, yeşil alan oranı vb.)
5. **Galeri** — kategorili görsel galeri, lightbox
6. **Sosyal olanaklar** — slider veya grid, ikon + isim + kısa açıklama
7. **Vaziyet planı** — interaktif veya statik büyük görsel
8. **Daire / plan tipleri** — kategorili slider (1+1, 2+1 vb.), her plan için görsel + tablo
9. **360° modal** — (opsiyonel, içerik varsa) tam ekran modal
10. **Quick contact modal** — her yerde açılabilir, form
11. **Alt CTA band** — “Projeyi yerinde görmek ister misiniz?”
12. **Footer**

**Birincil CTA:** Quick contact modal (“Size ulaşalım”)
**Veri ihtiyacı:** [docs/06-engineering/CONTENT_SCHEMA.md](../06-engineering/CONTENT_SCHEMA.md) → `project` şeması

> İçerik detay şablonu: [docs/03-content/PROJECT_DETAIL_TEMPLATE_CONTENT.md](../03-content/PROJECT_DETAIL_TEMPLATE_CONTENT.md)

---

## `/hizmetler`

**Amaç:** Sitre Yapı’nın hizmet alanlarını ve değer önermelerini açıklamak.

**Section listesi:**
1. **Hero** — kısa başlık + giriş paragrafı
2. **Hizmet kartları** — 3–5 hizmet: proje geliştirme, mimari danışmanlık, taahhüt, yatırım danışmanlığı, (varsa) tadilat
3. **Yaklaşım** — nasıl çalışıyoruz — adımlar
4. **CTA band** — “Görüşme talep et”
5. **Footer**

**Birincil CTA:** Görüşme talep et
**Veri ihtiyacı:** hizmet kartları listesi

---

## `/iletisim`

**Amaç:** Formla, telefonla, mailla, yerinde ziyaretle bağlantı kurmak.

**Section listesi:**
1. **Başlık bloğu** — “İletişime geçin”
2. **İletişim bilgileri + çalışma saatleri** — adres, telefon, mail, harita yönlendirmesi
3. **Ana iletişim formu** — tam form (ad, tel, mail, konu, mesaj, KVKK onay)
4. **Harita** — interaktif harita (marker, büyütme)
5. **CTA / alt band** — opsiyonel “WhatsApp” veya “hemen ara” (tonla uyumlu)
6. **Footer**

**Birincil CTA:** Form submit
**Veri ihtiyacı:** ofis bilgileri, form endpoint

---

## `/kvkk`

**Amaç:** Yasal aydınlatma metni.

**Section listesi:**
1. **Başlık + son güncelleme tarihi**
2. **Uzun form metin** — markdown’dan render
3. **Footer**

**Birincil CTA:** yok
**Veri ihtiyacı:** KVKK metin dosyası

---

## `/cerez-politikasi`

**Amaç:** Çerez kullanımı hakkında bilgilendirme.

**Section listesi:**
1. **Başlık + son güncelleme tarihi**
2. **Uzun form metin**
3. **Tercih yönetimi linki** — çerez banner’ı tekrar açma
4. **Footer**

**Birincil CTA:** Çerez tercihlerini yönet
**Veri ihtiyacı:** çerez politikası metin dosyası

---

## `/404`

**Amaç:** Kayıp kullanıcıyı marka tonuyla karşılayıp ana sayfaya yönlendirme.

**Section listesi:**
1. **Büyük sade mesaj** — “Aradığınız sayfa burada değil.”
2. **CTA** — Ana sayfaya dön + Projeleri gör
3. **Footer**

**Birincil CTA:** Ana sayfaya dön
**Veri ihtiyacı:** yok

---

## Ortak öğeler (tüm sayfalarda)

- **Header** — logo, nav, dil seçici (faz 1’de gizli), iletişim CTA
- **Footer** — kısa kurumsal özet, nav linkleri, yasal linkler, iletişim, sosyal medya ikonları
- **Çerez bandı** — ilk ziyarette
- **Quick contact modal** — tetikleyen buton her sayfada (hero CTA veya floating), bir kez açık
- **Skip link** — `#main` erişilebilirlik için
