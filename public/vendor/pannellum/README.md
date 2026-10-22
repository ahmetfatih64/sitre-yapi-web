# Pannellum (vendor kopyası)

360° panorama görüntüleyici. Sanal tur bölümü (`VirtualTour`) bu dosyaları
kullanıcı turu başlattığında `<script>`/`<link>` ile yükler.

| | |
|---|---|
| Sürüm | 2.5.7 |
| Lisans | MIT — `LICENSE` dosyasına bakın (Matthew Petroff) |
| Kaynak | https://github.com/mpetroff/pannellum — npm `pannellum@2.5.7` |
| Dosyalar | `pannellum.js` (56 KB), `pannellum.css` (9,7 KB) |

## Neden CDN değil

Kendi sunucumuzdan servis ediliyor; böylece CSP `script-src 'self'` ile
yetinebiliyor, üçüncü taraf bir alan adına bağımlılık ve kullanıcı izleme
riski doğmuyor.

## Nasıl güncellenir

```bash
npm pack pannellum@<yeni-surum>
tar -xzf pannellum-<yeni-surum>.tgz
cp package/build/pannellum.js package/build/pannellum.css public/vendor/pannellum/
cp package/COPYING public/vendor/pannellum/LICENSE
```

Sürümü bu dosyadaki tabloda da güncelleyin, sonra sanal tur e2e testlerini
çalıştırın: `npx playwright test -g "sanal tur"`.
