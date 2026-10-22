# Sanal tur görselleri

| Dosya | Boyut | Ne zaman yüklenir |
|---|---|---|
| `kapak.jpg` | 1600×1000 | Sayfayla birlikte (tur kapağı) |
| `panorama-4k.jpg` | 4096×2048 | Kullanıcı turu başlatınca, doku sınırı ≥ 4096 ise |
| `panorama-2k.jpg` | 2048×1024 | Kullanıcı turu başlatınca, dar ekran veya doku sınırı < 4096 ise |

## Kaynak ve lisans

- Varlık: **Brown Photostudio 02** — https://polyhaven.com/a/brown_photostudio_02
- Fotoğrafçı: Sergej Majboroda
- Lisans: **CC0 1.0** (kamu malı). Atıf zorunlu değildir; yine de arayüzde
  kaynak belirtiliyor.
- Orijinal: 8192×4096 tonemapped JPG. Buradaki dosyalar ondan ffmpeg ile
  üretildi (`scale=...:flags=lanczos`, kapak için `v360=e:flat yaw=115`).

> **Bu temsilî bir görseldir.** Sitre Yapı'nın gerçek bir dairesi değildir.
> Müşteri kendi 360° çekimlerini verdiğinde bu dosyalar değiştirilmelidir;
> `project.tour` alanındaki yollar güncellenince başka kod değişikliği gerekmez.
