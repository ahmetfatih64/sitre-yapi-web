# Dağıtım

Bu belge siteyi sıfırdan ayağa kaldırma adımlarını içerir. Sıra önemlidir.

## 1. Ortam değişkenleri

`.env.example` dosyasını kopyalayıp doldurun. Her değişkenin yanında
**eksik bırakılırsa ne olacağı** yazılıdır — bu uygulama eksik değişkende
çökmez, ilgili özelliği sessizce kapatır.

```bash
cp .env.example .env.local
```

Doldurduktan sonra sözleşmeyi doğrulayın:

```bash
NEXT_PUBLIC_APP_ENV=production npm run check:env
```

Çıkış kodu 0 değilse dağıtmayın. Hata mesajları hangi davranışın
kaybedileceğini söyler.

> **En sık yapılan hata:** `NEXT_PUBLIC_APP_ENV` ayarlanmadan canlıya
> çıkmak. Bu değer `production` değilse `robots.txt` `Disallow: /` üretir
> ve site arama motorlarına tamamen kapanır. Yayına aldıktan sonra
> `https://alan-adiniz/robots.txt` adresini mutlaka kontrol edin.

## 2. Veritabanı

PostgreSQL gerekir. Neon, Supabase veya Railway ücretsiz katmanları yeterlidir.

```bash
npm run db:migrate      # şemayı uygular (prisma migrate deploy)
npm run db:generate     # Prisma istemcisini üretir
npm run db:seed         # depodaki TS içeriğini aktarır ve yayınlar
```

`db:seed` idempotenttir; slug üzerinden upsert yapar, tekrar çalıştırmak
güvenlidir. Aktarmadan önce her kaydı Zod ile doğrular.

### Yerel geliştirme için veritabanı

Docker varsa:

```bash
docker run -d --name sitre-postgres \
  -e POSTGRES_USER=sitre -e POSTGRES_PASSWORD=sitre_dev_local \
  -e POSTGRES_DB=sitre -p 5433:5432 postgres:16-alpine
```

`.env` (Prisma CLI bunu okur, `.env.local`'i okumaz):

```
DATABASE_URL=postgresql://sitre:sitre_dev_local@localhost:5433/sitre?schema=public
```

## 3. Yönetim paneline giriş

Giriş e-posta bağlantısı (magic link) ile yapılır. Gerekli değişkenler:

- `NEXTAUTH_SECRET` — `openssl rand -base64 32` (en az 32 karakter)
- `NEXTAUTH_URL` — sitenin genel adresi
- `POSTMARK_SERVER_TOKEN` ve `POSTMARK_FROM` — bunlar olmadan bağlantı
  e-postası gönderilemez, yani giriş yapılamaz

Bu üçü eksikse `/api/auth/*` uç noktası 503 döner ve nedenini söyler.

### İlk yönetici

Auth.js ile ilk giriş yapan kişi şemadaki varsayılan `VIEWER` rolünü alır.
Panele erişmek için en az bir `OWNER` gerekir:

```bash
npm run db:promote -- sizin@eposta.com
```

Kullanıcı yoksa script hangi adreslerin kayıtlı olduğunu listeler.

## 4. Zamanlanmış görev

Bildirim kuyruğunu (outbox) işleyen uç nokta:

```
POST /api/cron/outbox
Authorization: Bearer <CRON_SECRET>
```

`CRON_SECRET` üretimde boş bırakılırsa uç nokta tüm istekleri reddeder ve
bekleyen bildirimler hiç gönderilmez. Vercel Cron, GitHub Actions veya
herhangi bir zamanlayıcı ile dakikada bir çağırmak yeterlidir.

## 5. İçerik mimarisi

Site içeriği iki kaynaktan okunabilir ve bu kasıtlıdır
([service.ts](../src/content/projects/service.ts)):

1. **Veritabanı** — `PublishedProjectProjection` tablosundaki yayınlanmış
   projeksiyon. `DATABASE_URL` tanımlıysa önce buraya bakılır.
2. **Depodaki TS dosyaları** — `src/content/projects/`. Veritabanı yoksa,
   boşsa veya sorgu hata verirse buraya düşülür.

Bu sayede site veritabanı sağlanmadan da çalışır ve geçiş kesintisiz olur.

Veritabanından gelen her kayıt sayfaya ulaşmadan
[schema.ts](../src/content/projects/schema.ts) ile doğrulanır. Bozuk tek bir
kayıt tüm listeyi düşürmez, yalnızca kendisi elenir ve loglanır.

### Sunumsal içerik neden JSON?

`Project.contentJson` alanı hero, concept, features, gallery, plans,
amenities, siteplan ve bottomCta bloklarını taşır. Bunları ilişkisel modele
açmak ~8 ek tablo demektir ve bu alanlar sorgulanmaz — yalnızca render
edilir. Sorgulanan alanlar (slug, durum, tarih, meta) sütun olarak durur ve
yayın sırasında JSON'un üzerine yazılır, böylece sütunlar tek otoritedir.

## 6. Dağıtım öncesi kontrol listesi

```bash
npm run check:env      # ortam sözleşmesi
npm run typecheck
npm run lint           # --max-warnings=0
npm run test:unit
npm run test:e2e
npm run build
```

Yayına aldıktan sonra:

- `https://alan-adiniz/robots.txt` → `Disallow: /` **olmamalı**
- `https://alan-adiniz/sitemap.xml` → tüm sayfaları listelemeli
- `https://alan-adiniz/api/health` → hangi entegrasyonların açık olduğunu gösterir

## 7. Kendi sunucunda barındırma — `trustHost`

Auth.js v5, tanımadığı bir barındırmada gelen `Host` başlığına varsayılan
olarak güvenmez. Bu ayar olmadan **tüm auth uç noktaları 500 döner** ve
giriş hiç çalışmaz:

```
[auth][error] UntrustedHost: Host must be trusted.
```

Vercel bunu otomatik ayarlar. VPS, Docker, Coolify, Render gibi ortamlarda
gerekli olduğu için `authConfig` içinde `trustHost: true` açıkça verilmiştir
([nextauth.ts](../src/lib/auth/nextauth.ts)).

Bunun karşılığında **ters vekil sunucunun doğru başlığı geçirmesi**
dağıtımın sorumluluğudur. Nginx için:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Proto $scheme;
```

Kanonik köken ayrıca `NEXTAUTH_URL` ile sabitlenir.

## 8. Yerel geliştirme yığını

Postmark hesabı olmadan giriş akışını uçtan uca test etmek için:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Bu iki servisi ayağa kaldırır:

| Servis | Adres | İş |
|---|---|---|
| PostgreSQL | `localhost:5433` | veritabanı |
| Mailpit | http://localhost:8025 | giden e-postaları yakalar, dışarı çıkarmaz |

`.env.local` içine:

```
DATABASE_URL=postgresql://sitre:sitre_dev_local@localhost:5433/sitre?schema=public
EMAIL_SERVER_HOST=localhost
EMAIL_SERVER_PORT=1025
EMAIL_FROM=bilgi@sitreyapi.local
```

Ayrıca Prisma CLI `.env.local` okumaz, yalnızca `.env` okur — `DATABASE_URL`
her iki dosyada da bulunmalıdır.

Giriş akışını denemek: `/admin/login` üzerinden e-posta gir, gelen bağlantıyı
http://localhost:8025 adresinden aç. İlk giriş `VIEWER` doğurur;
`npm run db:promote -- <eposta>` ile `OWNER` yap.

## 9. Şema değişikliği ve migration üretimi

Şemayı değiştirdikten sonra migration üretmek için **yalnızca** şunu kullanın:

```bash
docker compose -f docker-compose.dev.yml up -d   # shadow için yerel Postgres
npm run db:diff -- <migration_adi>
npm run db:migrate                                # üretime uygular
npm run db:generate                               # istemciyi tazeler
```

### Neden ayrı bir script var

`prisma migrate diff --shadow-database-url <url>` verilen adresteki **tüm
veriyi siler**. Bir kez üretim adresi verildi ve Neon'daki veritabanı
boşaldı; tohumlama verisi olduğu için kayıp telafi edildi, ama canlı
müşteri talepleri olsaydı geri dönüşü olmazdı (ücretsiz katmanda yedek yok).

[scripts/db-diff.mjs](../scripts/db-diff.mjs) bu hatayı imkânsız kılar:

- `SHADOW_DATABASE_URL` tanımlı değilse çalışmaz
- Adres `localhost` / `127.0.0.1` değilse **reddeder**
- Shadow adresi `DATABASE_URL` veya `DIRECT_URL` ile aynıysa reddeder
- Fark yoksa boş migration klasörü bırakmaz

### Prisma istemcisini tazelemeyi unutmayın

Migration veritabanına sütunu ekler ama **istemci eski kalır**. Dev sunucusu
çalışırken üretilen istemci bellekte tutulduğu için sunucuyu durdurup
`npm run db:generate` çalıştırın. Aksi halde yeni sütun
`Unknown argument` hatası verir ve kayıtlar sessizce düşer.

### İlişkili alanlar

`Lead.projectId` gibi yabancı anahtarlara **slug değil `id`** yazılır ve
Prisma bunu skaler olarak kabul etmez:

```ts
// yanlış: Unknown argument `projectId`
data: { projectId: someId }

// doğru
data: { project: { connect: { id: someId } } }
```

---

## 10. İçerik güvenlik politikası (CSP) — rotaya göre iki mod

### Sorun

`'strict-dynamic'` içeren nonce tabanlı bir CSP, **yalnızca her istekte
sunucuda render edilen sayfalarda** çalışır. Next.js statik olarak önceden
ürettiği HTML'e RSC verisini satır içi `<script>` olarak gömer ve bu
etiketlere istek başına üretilen nonce basılamaz.

`'strict-dynamic'` varken tarayıcı `script-src` içindeki **`'self'`
kaynağını yok sayar**. Sonuç: statik sayfada hiçbir script'e izin verilmez,
site üretimde hiç hidratlanmaz — menü, formlar, galeri, sanal tur, hiçbiri
çalışmaz. Dev sunucusunda her sayfa dinamik render edildiği için sorun
**yalnızca üretim derlemesinde** görünür.

### Çözüm

`buildCsp` iki mod üretir ve `src/middleware.ts` rotaya göre seçer:

| Rota | Mod | `script-src` |
|---|---|---|
| `/admin/*`, `/api/*` (hepsi `force-dynamic`) | `nonce` | `'self' 'nonce-…' 'strict-dynamic'` |
| Diğer tüm (statik üretilen) sayfalar | `static` | `'self' 'unsafe-inline'` |

Nonce'lu modda middleware, nonce'u **isteğin** `Content-Security-Policy`
başlığına da yazar. Next.js nonce'u yalnızca oradan okur; bu satır olmadan
script'ler nonce'suz üretilir ve admin paneli de engellenir.

### Bunun bedeli: public sayfalarda CSS satır içi script'i durdurmaz

Statik sayfalarda `'unsafe-inline'` zorunlu olduğu için **CSP orada bir XSS
enjeksiyonunu engellemez.** Güvenlik tamamen "ham HTML basılan her yerin
güvenli olması" varsayımına dayanır.

Bu varsayım bir kez çöktü ve ciddiye alınmalıdır:

> JSON-LD, yönetim panelinden düzenlenen proje adını/açıklamasını
> `JSON.stringify` ile `<script type="application/ld+json">` bloğunun içine
> basıyordu. `JSON.stringify` `<` karakterini kaçırmaz, dolayısıyla alan
> değeri içindeki bir `</script>` bloğu erken kapatıyor ve ardından gelen
> her şey çalıştırılabilir script oluyordu. Tarayıcıda doğrulandı: 1 yerine
> 2 script etiketi oluşuyor ve enjekte edilen kod çalışıyordu.

Çözüm `src/lib/json-ld.ts` içindeki `serializeJsonLd`: `<` karakterini
`<` yapar, JSON çözümlemesi değişmez. **JSON-LD hiçbir zaman ham
`JSON.stringify` ile basılmamalıdır.**

### Nöbetçi: ham HTML basımı denetimi

`tests/guards/html-safety.test.ts` tüm `src/` ağacını tarar ve onaylı
yoldan geçmeyen her `dangerouslySetInnerHTML` / `innerHTML` atamasında
testi düşürür. Onaylı yollar:

- `serializeJsonLd(...)` — yapısı gereği güvenli, her yerde serbest
- Dosya + ifade bazında, **gerekçesiyle** listeye yazılmış istisnalar
  (bugün yalnızca depo içinde sabit yazılı hukuki metinler)

Yeni bir ham HTML basımı eklemek, onu bu listeye gerekçesiyle yazmayı
gerektirir. Nöbetçinin kendisi de test edilir: tarayıcı bozulup hiçbir
kullanım bulamaz hale gelirse test yine düşer.

> **Herkese açık bir sayfaya kullanıcıdan gelen HTML basılacaksa** bu
> değerlendirme yeniden yapılmalıdır — o noktada statik + `'unsafe-inline'`
> tercihi savunulamaz hale gelebilir ve ilgili rota dinamik render'a
> alınmalıdır.

### Dikkat

- Bir sayfaya `export const dynamic = "force-dynamic"` eklenirse yolu
  `src/middleware.ts` içindeki `DYNAMIC_PREFIXES` listesine de eklenmelidir;
  yoksa gereğinden zayıf politikayı alır.
- `buildCsp` nonce modunda nonce verilmezse **hata fırlatır**. Sessizce zayıf
  politika üretmesindense derlemenin patlaması tercih edilir.

### Nöbetçi testler

Bu hata dev sunucusunda görünmediği için testlerle sabitlendi:

- `packages/security/src/csp.test.ts` — iki mod, nonce'suz çağrının hata
  vermesi, `static` modda `strict-dynamic` bulunmaması
- `tests/e2e/ui.spec.ts` → "içerik güvenlik politikası" — statik ve dinamik
  rotaların doğru başlığı alması, sayfa yüklenirken konsola CSP ihlali
  düşmemesi
- `src/lib/json-ld.test.ts` — `</script>` ve satır ayırıcı karakterlerin
  kaçırılması, kaçırma sonrası JSON'un aynı veriyi çözmesi
- `tests/guards/html-safety.test.ts` — onaylanmamış ham HTML basımı

---

## 11. Üretim derlemesi dev sunucusunu bozmasın

`next build` ile `next dev` varsayılan olarak aynı `.next` dizinini kullanır.
Dev sunucusu açıkken `npm run build` çalıştırılırsa dev sunucusunun
chunk'ları silinir ve sunucu şu hatayla 500 vermeye başlar:

```
ENOENT: no such file or directory, open '.next/server/edge/chunks/...'
```

Hata mesajı nedeni belli etmediği için teşhisi zordur. Bu yüzden üretim
derlemesi ayrı bir dizine alınır:

```bash
npm run build:prod   # .next-prod dizinine derler
npm run start:prod   # .next-prod dizininden sunar
```

`scripts/prod.mjs` yalnızca `NEXT_DIST_DIR` değişkenini ayarlayıp `next`
komutunu çağırır; `next.config.ts` bu değişkeni `distDir` olarak kullanır.
`.next-prod` `.gitignore` içindedir.

> Dağıtım ortamında dev sunucusu olmadığı için düz `npm run build` /
> `npm run start` kullanmak da sorunsuzdur. Ayrı dizin, yerelde geliştirme
> sürerken üretim derlemesi doğrulamak içindir.

---

## 12. Katalog ("Kataloğu indir")

Katalog sunucuda PDF olarak **üretilmez**. Proje sayfasının kendisi baskı
için biçimlendirilir (`src/app/globals.css` → `@media print`) ve düğme
`window.print()` çağırır; kullanıcı tarayıcıdan "PDF olarak kaydet" der.

**Neden bu yol:** üretilen kat planları SVG olduğu için kağıtta ve PDF'te
vektörel, yani her ölçekte net çıkar. Sunucuda PDF üretmek ayrıca bir
kütüphane, Türkçe karakterler için gömülü yazı tipi ve ek çalışma zamanı
maliyeti getirirdi.

### Baskıya özel parçalar

| Parça | Dosya | Ne yapar |
|---|---|---|
| Künye kapağı | `src/components/print/PrintCover.tsx` | Ekrandaki kahraman bölümü kağıtta işe yaramaz; yerine marka, proje künyesi, iletişim ve temsilîlik notu basılır |
| Plan föyleri | `src/components/print/PlanSheets.tsx` | Ekrandaki plan bölümü kategori süzgecine bağlıdır ve tek tip gösterir; katalogda **tüm** tipler bulunmalıdır |
| Düğme | `src/components/ui/PrintButton.tsx` | `window.print()` |

### Kurallar

- **Gizlenecek her şey `data-print="hide"` ile işaretlenir.** `header`,
  `footer` gibi element seçicileri kullanılmaz: baskıya özel bloklar da
  semantik `<header>` içerir ve onlar da gizlenirdi (bir kez oldu, plan
  föylerinin başlıkları kayboldu).
- `.reveal` baskıda zorla görünür kılınır. Sahneleme animasyonu öğeleri
  görüş alanına girene kadar `opacity: 0` tutar; bu kural olmadan
  **katalogun büyük bölümü boş basılır.**
- `.btn` baskıda gizlenir. İçerik taşıyan `<button>`'lar (ör. oda listesi)
  bu sınıfı kullanmadığı için etkilenmez — bu yüzden `button` seçicisi
  kullanılmaz.

### Nöbetçi testler

`tests/e2e/ui.spec.ts` → "katalog / baskı": baskı medyasında kabuğun
gizlenmesi, künyenin çıkması, `.reveal` opaklığının 1 olması, üç plan
föyünün de basılması, eylem düğmesi kalmaması ve ekranda baskı bloklarının
görünmemesi.

> **Turbopack notu:** `globals.css` sonuna eklenen kurallar bazen
> derlenmeden kalıyor. Değişiklik uygulanmadıysa dosyanın sonuna bir satır
> ekleyip (`printf '\n' >> src/app/globals.css`) yeniden derlemeyi tetikleyin
> ve tarayıcıda hesaplanan stilden doğrulayın.
