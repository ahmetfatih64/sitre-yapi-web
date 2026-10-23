# Yayın öncesi kontrol listesi

Bu site şu an **tanıtım sürümüdür**: içeriğin tamamı temsilîdir. Aşağıdakiler
yapılmadan canlıya alınmamalıdır.

---

## 1. Derleme anında verilmesi gereken değişkenler

> **En kritik madde.** `NEXT_PUBLIC_*` değişkenleri **derleme anında** koda
> gömülür. Yalnızca çalışma anında (başlatma komutunda, panelde "runtime env")
> verilmesi **İŞE YARAMAZ** ve hata da vermez — site sessizce yanlış çalışır.

| Değişken | Verilmezse ne olur |
|---|---|
| `NEXT_PUBLIC_APP_ENV=production` | `robots.txt` `Disallow: /` üretir, **site arama motorlarına tamamen kapanır**; sitemap tek satıra düşer |
| `NEXT_PUBLIC_SITE_URL=https://alan-adiniz` | Kanonik adresler, OG etiketleri, sitemap, robots ve JSON-LD yedek adresi gösterir. Sonunda eğik çizgi olmamalı |

Doğrulama: `NEXT_PUBLIC_APP_ENV=production npm run check:env`

## 2. Sunucu tarafı değişkenler

`npm run check:env` eksikleri ve her birinin sonucunu listeler. Üretimde
zorunlu olanlar:

| Değişken | Verilmezse |
|---|---|
| `DATABASE_URL` | Form talepleri hiçbir yere kaydedilmez; kullanıcıya başarılı görünür |
| `NEXTAUTH_SECRET` | Oturumlar imzalanamaz, yönetim paneline girilemez |
| `POSTMARK_SERVER_TOKEN` | Sihirli bağlantı gönderilemez, panele giriş yapılamaz |
| `LEAD_NOTIFY_TO` | Yeni talep bildirimi kimseye ulaşmaz |
| `CRON_SECRET` | Giden posta kuyruğu (outbox) ucu korumasız kalır |
| `NEXT_PUBLIC_SITE_URL` | Bkz. §1 — derleme anında verilmelidir |

Ayrıntı ve her birinin tam sonucu: [../DEPLOYMENT.md](../DEPLOYMENT.md) §1.

E-posta sağlayıcısı (Postmark ya da SMTP) bağlanmadan **yönetim paneline
giriş yapılamaz** — giriş sihirli bağlantıyla çalışır.

## 3. Değiştirilecek içerik

`src/content/site.config.ts`:

- [ ] `contact.email` — şu an `info@sitreyapi.example`
- [ ] `social[]` — üçü de boş profil adresi (`https://instagram.com/` vb.)
- [ ] `legal.taxOffice` / `legal.taxNumber` — şu an `—`
- [ ] `contact.phone`, `founders[]`, adres ve koordinatları doğrulayın

`src/content/projects/*.ts` — **üç projenin tamamı kurgudur**, hiçbiri
gerçek bir Sitre Yapı projesi değildir:

| Dosya / slug | Görünen ad |
|---|---|
| `sitre-urla-konaklari` | Zeytin Bahçe Evleri |
| `sitre-bornova-park` | Yeşilvadi Konutları |
| `sitre-cesme-residence` | Vadi Konutları |

> Dosya adları ile görünen adlar örtüşmüyor. Gerçek projelere geçerken
> slug'ları da anlamlı hale getirin; slug adres çubuğunda görünür ve
> sonradan değiştirilirse eski bağlantılar kırılır.

Her proje için gözden geçirilecekler: ad, konum, durum, teslim tarihi,
alanlar, plan tipleri ve `rooms[]` (kat planı bu veriden üretilir),
`progress.milestones` ve `progress.updatedAt`, galeri görselleri.

> İçerik değiştirildikten sonra `npm run db:seed` çalıştırılmalıdır. Site
> içeriği veritabanından okur; yalnızca TS dosyasını değiştirmek yayına
> yansımaz.

## 4. Temsilî görseller

| Varlık | Durum |
|---|---|
| `public/images/stock/*` | Stok görseller — gerçek proje fotoğraflarıyla değiştirilmeli |
| `public/images/tour/*` | CC0 panorama (Poly Haven). Gerçek bir Sitre Yapı dairesi **değildir**; arayüzde "Temsilî görselleştirme" yazar |
| Kat planları | `rooms[]` verisinden üretilen **şematik** gösterim. Gerçek mimari çizim verilince `plans.items[].image` doldurulur, şema devre dışı kalır |
| `public/images/placeholders/*` | Yer tutucu — kalanlar değiştirilmeli |

Gerçek içerik geldiğinde "Temsilî görselleştirme" / "ölçekli mimari çizim
değildir" notları da gözden geçirilmelidir. Hâlâ temsilî olan bir şey varsa
**not kalmalıdır.**

## 5. Yayın öncesi komutlar

```bash
npm run check:env
npm run typecheck
npm run lint
npm run test:unit
npm run test:e2e
npm run build
```

Hepsi geçmeden dağıtım yapılmamalıdır; CI de aynı adımları koşar.

## 6. Yayın sonrası doğrulama

- [ ] `https://alan-adiniz/robots.txt` → `Disallow: /` **olmamalı**
- [ ] `https://alan-adiniz/sitemap.xml` → tüm sayfalar + her proje
- [ ] `https://alan-adiniz/api/health` → `isProd: true` ve açık olmasını
      beklediğiniz entegrasyonlar `true`
- [ ] Bir iletişim formu gönderip talebin yönetim paneline düştüğünü görün
- [ ] Yönetim paneline sihirli bağlantıyla giriş yapılabildiğini doğrulayın
- [ ] Proje sayfasında "Kataloğu indir" → PDF'te üç plan tipinin de çıktığını
      görün

## 6b. Bağımlılık açıkları — mevcut durum

`npm audit` 9 "high" bildiriyor. **Kritik ve orta seviye açık yoktur.**
Kalanların hepsi tek tek incelendi; hiçbiri bu kod tabanından
sömürülebilir değil ve hiçbirinin uygulanabilir bir yaması yok.

### Lint zinciri — üretime çıkmaz (5 kayıt)

`eslint-config-next`, `@next/eslint-plugin-next`, `braces`, `micromatch`,
`fast-glob`.

`eslint-config-next` bir **devDependency**'dir; bu paketlerin hiçbiri
üretim paketine girmez, yalnızca geliştirme sırasında lint çalıştırılırken
kullanılır. Ayrıca `braces` ve `fast-glob` için bildirilen etkilenen aralık
`*` — yani **hiçbir sürümde yama yok**, en güncel sürüm de etkileniyor.

> `npm audit fix` bunlar için `eslint-config-next@14.2.35` öneriyor. Bu bir
> **düşürmedir** ve Next 15 ile çelişir; uygulanmamalıdır.

### Auth.js zinciri (4 kayıt)

`nodemailer`, `@auth/core`, `@auth/prisma-adapter`, `next-auth`.

Kök neden `nodemailer`'daki SMTP komut enjeksiyonudur; vektör
`envelope.size` alanıdır.

**Bu kod tabanından ulaşılamaz:** `envelope` alanı hiçbir yerde
kullanılmıyor (`grep -rn "envelope" src/ packages/` boş döner). Tek
nodemailer kullanımı `src/lib/leads/direct-notify.ts` içindedir ve
`sendMail`'e yalnızca `from`, `to`, `subject`, `text` geçer. `to` değeri
kullanıcıdan değil `LEAD_NOTIFY_TO` ortam değişkeninden gelir.

**Yükseltme yolu yok:** açık `nodemailer <= 10.0.9` sürümlerini etkiliyor,
ancak `next-auth` ve `@auth/core` (en güncel sürümleri dahil) nodemailer'ı
`^7.0.7 || ^8.0.5` olarak bildiriyor. 10.x'e çıkmak bildirilen eşdüzey
aralığın dışına taşar ve sihirli bağlantıyla girişi sessizce bozabilir.

> **Takip edilmeli:** Auth.js nodemailer 10 desteğini eklediğinde
> `nodemailer` ve `next-auth` birlikte yükseltilmeli, ardından yönetim
> paneline sihirli bağlantıyla giriş elle denenmelidir.

### Denetim nasıl tekrarlanır

```bash
npm audit                    # özet
npm audit --json             # paket bazlı, fixAvailable alanıyla
```

Yeni bir kayıt çıkarsa aynı soruları sorun: üretime çıkıyor mu, vektör bu
koddan ulaşılabilir mi, uygulanabilir bir yama var mı.

---

## 7. Devredilecek hesaplar

- GitHub deposu
- Neon veritabanı (bölge: Frankfurt)
- E-posta sağlayıcısı + alan adı DNS kayıtları (SPF / DKIM / DMARC)
- Alan adı

> Bu hesapların sahipliği müşteriye devredilmelidir; aksi halde site
> geliştiricinin hesaplarına bağımlı kalır.
