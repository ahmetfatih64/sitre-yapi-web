# SUCCESS_CRITERIA — Başarı ölçütleri

Bu dosya, Faz 1’in “başarılı” sayılması için karşılanması gereken **ölçülebilir** kriterleri tanımlar. QA ve launch kararı bu kriterlere göre verilir — öznel “güzel görünüyor” yeterli değildir.

---

## 1. Mobil uyumluluk

| Kriter | Hedef |
|---|---|
| Desteklenen en dar viewport | 360px genişlik, hiçbir yatay scroll yok |
| Desteklenen aralık | 360px → 1920px+ kesintisiz |
| Dokunma hedefi | Min 44×44px (butonlar, nav öğeleri, form alanları) |
| Font okunabilirlik | Gövde ≥ 15px mobilde, ≥ 16px desktop |
| Görsel oran | Hero ve galeri görselleri mobilde kırpılmadan veya uygun kırpma ile gösterilir |
| Menü | Mobil menü açılır-kapanır, focus trap, escape ile kapanır |
| Form | Mobilde numerik klavye (`inputmode`), autofill, ok butonuyla submit |
| Modal | Mobilde tam ekran veya sheet, body scroll kilidi, safe-area inset desteği |

**Doğrulama:** Chrome DevTools responsive mod + gerçek cihaz (iPhone SE, iPhone 14, Android mid-range, iPad).

---

## 2. Lighthouse hedefleri

Üretim build’i üzerinde, mobil profil, `tr` yerel ayarı ile:

| Metrik | Minimum | Hedef |
|---|---|---|
| Performance (mobile) | 80 | ≥ 90 |
| Accessibility | 95 | 100 |
| Best Practices | 90 | ≥ 95 |
| SEO | 95 | 100 |

**Core Web Vitals (mobile, p75):**
- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.05

Lighthouse skoru tek başına geçilmez; CWV field verisi (veya lab p75) de aynı eşikleri geçmelidir. Ölçüm her sayfa tipi için ayrı: ana sayfa, proje liste, proje detay, iletişim.

---

## 3. Lead form dönüşümü

| Kriter | Hedef |
|---|---|
| Form görünürlüğü | Her proje detay sayfasında ≥ 2 CTA (hero + quick contact modal) |
| Form doldurma süresi | Ortalama < 90sn (alan sayısı optimize) |
| Validation | Tüm zorunlu alanlar client-side + server-side doğrulanır |
| Başarı state | Form submit sonrası net “teşekkürler” state’i, sayfa refresh yok |
| Hata state | Backend hatası kullanıcıya açık bir mesajla gösterilir, veri kaybolmaz |
| KVKK onayı | Checkbox işaretlenmeden submit edilemez |
| Takip | Her başarılı gönderim analytics event’i tetikler (`form_submit`) |
| Spam koruması | reCAPTCHA v3 veya honeypot, her formda aktif |

> Dönüşüm oranı hedefi launch sonrası 4 hafta içinde belirlenir (baseline gözlem). Faz 1 kabul için yukarıdaki **fonksiyonel** kriterler yeterlidir.

---

## 4. SEO hazır yapı

| Kriter | Kabul |
|---|---|
| Title / description | Her sayfada benzersiz, şablondan türetilmiş |
| Canonical | Her sayfada doğru canonical (kendi URL’si) |
| Open Graph / Twitter | Her sayfada `og:title`, `og:description`, `og:image`, `og:url` |
| JSON-LD | Organization (tüm sayfalarda), BreadcrumbList, RealEstateListing (proje detay) |
| Sitemap | `/sitemap.xml` otomatik üretilir, tüm public route’ları içerir |
| Robots | `/robots.txt` mevcut, staging’de `noindex` |
| Heading hiyerarşisi | Her sayfada tek `h1`, `h2→h3` sıralaması tutarlı |
| Alt metin | Tüm anlamlı görsellerde `alt` doldurulmuş |
| URL yapısı | `/projeler/[slug]` gibi okunur, küçük harf, tire ayraçlı |
| Dahili linkleme | Ana sayfa → projeler → proje detay → iletişim akışı ≤ 2 tık |
| Çoklu dil hazır | `hreflang` altyapısı mevcut (faz 1’de aktif değil) |

---

## 5. Kolay içerik güncelleme

| Kriter | Kabul |
|---|---|
| Yeni proje ekleme | Tek bir içerik kaydı (markdown/JSON veya CMS) + görsel klasörü yeterli; kod dokunuşu yok |
| Yeni proje go-live süresi | Stakeholder içerik hazırladıktan sonra ≤ 1 saat |
| Ana sayfa öne çıkan projeler | Config dosyası veya bayraklar üzerinden sıralanabilir |
| Menü güncellemesi | Tek config dosyası |
| Yasal metin güncellemesi | Tek markdown dosyası |
| Görsel güncellemesi | Public klasör veya CDN yolu; kod değişmez |
| Dokümantasyon | [DEPLOYMENT_AND_HANDOFF.md](../08-handoff/DEPLOYMENT_AND_HANDOFF.md) içinde adım adım |

---

## 6. Ek kalite kapıları

- **Konsol temizliği:** Üretim build’inde tarayıcı konsolunda hata, uyarı, 404 asset yok.
- **Link sağlığı:** Tüm iç linkler 200 döner, kırık dış link yok (launch anında doğrulanır).
- **Erişilebilirlik:** axe DevTools taraması kritik hata vermez; klavye ile tüm sayfalar gezilebilir.
- **Cross-browser:** Son Chrome, Safari, Firefox, Edge’de görsel ve fonksiyonel regresyon yok.
- **Reduced motion:** `prefers-reduced-motion` aktifken büyük giriş animasyonları devre dışı.

---

## 7. Launch geçiş kriteri

Launch ancak şu koşullar **birlikte** sağlanırsa yapılır:

- [ ] Tüm yukarıdaki bölümler ≥ minimum eşiğinde
- [ ] [docs/07-qa/PRELAUNCH_CHECKLIST.md](../07-qa/PRELAUNCH_CHECKLIST.md) tamamen işaretli
- [ ] Stakeholder içerik onayı alındı
- [ ] Hukuki metinler onaylı ve yayında
- [ ] Form backend canlı ortamda test edildi (gerçek mail ulaştı)
- [ ] Analytics event’leri gerçek veri gösteriyor
- [ ] Yedekleme / rollback planı hazır
