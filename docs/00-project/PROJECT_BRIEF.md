# PROJECT_BRIEF — Sitre Yapı Kurumsal Web Sitesi

## 1. Sitre Yapı kim?

Sitre Yapı, konut ve karma kullanımlı gayrimenkul projeleri geliştiren, mimari kaliteyi ve yaşam deneyimini ön planda tutan bir yapı markasıdır. Marka, klasik müteahhit algısının dışında; **tasarım odaklı, güven veren, uzun vadeli değer üreten** bir geliştirici kimliği kurmayı hedefler.

> Not: Marka hakkında kesinleşmemiş bilgiler stakeholder ile doğrulanarak burada güncellenir. Bu dosya tek gerçeklik kaynağıdır — varsayım üretildiyse açıkça işaretlenir.

---

## 2. Sitenin amacı

Web sitesi dört temel işi yapar:

1. **İtibar / kurumsal vitrin** — Sitre Yapı’nın mimari diline, kalite standardına ve portföyüne dair güven veren bir sahne.
2. **Proje pazarlaması** — Aktif ve tamamlanmış projelerin premium bir dille sunulması; proje detay şablonu üzerinden derinlemesine anlatım (konsept, lokasyon, olanaklar, plan tipleri, galeri).
3. **Lead üretimi** — Quick contact modal, ana iletişim formu ve telefon üzerinden nitelikli potansiyel müşteri yakalama.
4. **SEO erişimi** — Proje adları, lokasyon sorguları ve kurumsal arama sonuçlarında organik görünürlük.

---

## 3. Hedef kitle

### Birincil
- **Üst-orta ve üst segment konut alıcıları** — 35–60 yaş, tasarım ve lokasyon duyarlı, araştırarak karar veren.
- **Yatırımcılar** — değer artışı ve kira getirisine bakan, kurumsal şeffaflık bekleyen.

### İkincil
- **Mimarlar, iç mimarlar, tasarımcılar** — proje kalitesini mesleki olarak değerlendiren kanaat önderleri.
- **Basın ve sektör medyası** — proje lansmanları ve kurumsal haberler için.
- **İş ortakları** — arsa sahipleri, finans kurumları, tedarikçiler.
- **İş adayları** — kurum kültürü ve açık pozisyonlar için (faz 2).

---

## 4. Premium konumlandırma

Site, şu **üst-segment algı** için tasarlanır:

- **Sadelik > gürültü.** Geniş boşluk, güçlü tipografi, az ama büyük görsel.
- **Mimari dil.** Görseller ve tipografi mimari fotoğrafçılığın ciddiyetini taşır; stok görsel izlenimi yaratmaz.
- **Yavaş, özenli motion.** Hover ve entrance animasyonları belirgin ama abartısız; reduced-motion desteği zorunlu.
- **Detay kalitesi.** Mikro etkileşimler, form davranışı, boş state’ler ve 404 sayfası bile marka deneyiminin parçası.
- **Güven sinyalleri.** Teslim edilmiş projeler, sayılar, ekip ve sertifikalar açıkça sunulur — ama abartısız.
- **Satış odaklı ama agresif değil.** CTA’lar net ama “hemen ara!” tonu yok; “size ulaşalım”, “randevu oluşturun” gibi davet dili.

> Karşı-referanslar (olmak istenmeyen): kalabalık slider’lı müteahhit siteleri, stok görselli, pop-up bombardımanı yapan, renk taşkını, yazım hatası dolu klasik emlakçı siteleri.

---

## 5. İş hedefleri

| Hedef | Ölçüm |
|---|---|
| Nitelikli lead üretimi | Ay başına form + telefon + quick-contact toplamı |
| Kurumsal itibar | Marka arama trafiği, ortalama oturum süresi, basın geri dönüşü |
| Proje pazarlaması | Proje detay sayfası görüntülenmesi, scroll derinliği, galeri etkileşimi |
| SEO erişimi | Organik trafik, ilk 10 sonucu alan anahtar kelime sayısı |
| İçerik çevikliği | Yeni proje ekleme süresi < 1 gün (kod dokunuşu olmadan) |

Hedef eşikleri ve “kabul edilebilir” değerleri [SUCCESS_CRITERIA.md](SUCCESS_CRITERIA.md) içinde tanımlıdır.

---

## 6. Kritik başarı faktörleri

- **Proje detay şablonu** — sitenin kalbi. Tek bir premium şablon tüm projelere uyarlanabilir olmalı.
- **Mobil deneyim** — trafiğin büyük kısmı mobil; hero, form ve galeri mobilde kusursuz çalışmalı.
- **Hız** — büyük görsellerle hızlı kalmak; next/image, lazy load, oran korumalı placeholder’lar.
- **İçerik güncelleme kolaylığı** — yeni proje eklemek bir markdown/JSON/CMS kaydı olmalı, kod değişikliği değil.
- **Marka tutarlılığı** — ton, görsel dil, spacing, tipografi tüm sayfalar arasında tutarlı.

---

## 7. Açık sorular (stakeholder ile netleşecek)

- Çok dil ilk fazda mı, faz 2’de mi? (varsayım: altyapı hazır, ilk fazda yalnız TR)
- CMS kullanılacak mı? (varsayım: faz 1 içerik markdown/JSON, faz 2 headless CMS opsiyonu)
- Blog/insights bölümü faz 1’de var mı? (varsayım: yok)
- Form backend: kendi mail servisi mi, üçüncü parti mi (Formspree/Resend/kendi API)?
- Analytics: GA4 yeterli mi, ek araç (Hotjar, Clarity) istenir mi?
- KVKK metinlerini kim sağlayacak — hukuk mu, biz mi taslak üretecek miyiz?

Bu sorular netleştikçe burası güncellenir ve [SCOPE.md](SCOPE.md) senkron edilir.
