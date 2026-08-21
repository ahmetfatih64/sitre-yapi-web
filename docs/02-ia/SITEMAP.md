# SITEMAP — Sitre Yapı

Faz 1 kapsamındaki tüm sayfalar ve hiyerarşileri. Kapsamdışı sayfalar [SCOPE.md](../00-project/SCOPE.md)’de belirtilir ve burada **yer almaz**.

---

## 1. Hiyerarşi

```
/                                   Ana sayfa
├── /hakkimizda                     Kurumsal hikaye, değerler, süreç
├── /projeler                       Projeler liste (filtreli)
│   ├── /projeler/[slug]            Proje detay (şablon)
│   └── … (her yeni proje bir slug)
├── /hizmetler                      Hizmet alanları
├── /iletisim                       İletişim formu + harita
├── /kvkk                           KVKK aydınlatma metni
├── /cerez-politikasi               Çerez politikası
└── /404                            Bulunamadı sayfası (otomatik)
```

**Notlar:**
- `/projeler/[slug]` tek bir premium şablon kullanır; içerik [PROJECT_DETAIL_TEMPLATE_CONTENT.md](../03-content/PROJECT_DETAIL_TEMPLATE_CONTENT.md) üzerinden gelir.
- Çok dilli altyapı hazırdır ama faz 1’de aktif dil yalnız `tr`. `hreflang` yapıları mevcut ama tek dil döner.
- Blog, kariyer, yatırımcı sayfaları **yok** — faz 2.

---

## 2. Sayfa amaçları (tek cümle özet)

| Route | Amaç | Birincil CTA |
|---|---|---|
| `/` | Marka vitrini + öne çıkan projeler + davet | “Projeleri keşfet” |
| `/hakkimizda` | Güven ve mimari dil anlatımı | “İletişime geç” |
| `/projeler` | Tüm projeleri filtreli görmek | “Detayları incele” |
| `/projeler/[slug]` | Bir projeyi derinlemesine satış anlatımı | “Size ulaşalım” (quick contact) |
| `/hizmetler` | Sitre Yapı’nın sunduğu alanlar | “Görüşme talep et” |
| `/iletisim` | Form, telefon, adres, harita | Form submit |
| `/kvkk` | Yasal aydınlatma | — |
| `/cerez-politikasi` | Yasal bilgilendirme | — |
| `/404` | Kayıp kullanıcıyı kurtarma | “Ana sayfaya dön” |

---

## 3. Public, hidden ve sistem route’ları

### 3.1 Public (navigasyonda görünür)
- `/`
- `/hakkimizda`
- `/projeler`
- `/hizmetler`
- `/iletisim`

### 3.2 Footer’da görünür (navigasyonda değil)
- `/kvkk`
- `/cerez-politikasi`

### 3.3 Dinamik
- `/projeler/[slug]` — sitemap’te otomatik genişler

### 3.4 Sistem
- `/sitemap.xml` — otomatik üretim
- `/robots.txt` — env’e göre üretim (staging’de `noindex`)
- `/404` — global

---

## 4. Derinlik kuralı

Her içeriğe ana sayfadan **en fazla 2 tık** ile ulaşılmalı:

- Ana sayfa → Projeler → Proje detay (2 tık ✅)
- Ana sayfa → Öne çıkan proje kartı → Proje detay (1 tık ✅)
- Ana sayfa → İletişim (1 tık ✅)

---

## 5. Çok dilli hazırlık (faz 2 için yapı)

```
/                ← tr (varsayılan, faz 1 aktif)
/en/             ← faz 2
/en/about
/en/projects
/en/projects/[slug]
/en/services
/en/contact
```

Faz 1’de `/en/*` route’ları **üretilmez**; i18n yapısı kod tarafında hazırdır ama dil seçici UI kapalı ve kaynak dosyalar yalnız `tr` içerir. Detay: [docs/06-engineering/TECH_ARCHITECTURE.md](../06-engineering/TECH_ARCHITECTURE.md).
