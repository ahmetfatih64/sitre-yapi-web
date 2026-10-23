# Yerel fontlar

Fontlar depodan servis edilir; `next/font/google` **kullanılmaz**.

## Neden

`next/font/google` fontları **derleme anında** `fonts.googleapis.com`'dan
indirir. Google erişilemez ya da istek sınırlanırsa derleme, nedenini hiç
belli etmeyen bir hatayla düşer:

```
An error occurred in `next/font`.
TypeError: Cannot read properties of null (reading '1')
```

Bu 22 Ekim 2026'da CI'da yaşandı. Fontlar depoda olduğu için derleme artık
ağdan tamamen bağımsızdır. Panorama görüntüleyicisi (`public/vendor/pannellum`)
de aynı gerekçeyle CDN yerine kendi sunucumuzdan servis ediliyor.

## Dosyalar

| Dosya | Boyut | Eksenler | Kaynak |
|---|---|---|---|
| `inter-latin.woff2` | 202 KB | `opsz` 14–32, `wght` 100–900 | [Inter](https://github.com/google/fonts/tree/main/ofl/inter) |
| `fraunces-latin.woff2` | 79 KB | `opsz` 9–144, `wght` 400–500 | [Fraunces](https://github.com/google/fonts/tree/main/ofl/fraunces) |

Her ikisi de **SIL Open Font License 1.1** altındadır; lisans metinleri
`Inter-OFL.txt` ve `Fraunces-OFL.txt` dosyalarında, yeniden dağıtım serbesttir.

## Nasıl üretildi

Google Fonts deposundaki değişken TTF kaynaklarından, `latin` **ve**
`latin-ext` unicode aralıkları birleştirilerek altküme alındı:

```bash
pip install "fonttools[woff]" brotli

# Fraunces: kullanılmayan eksenleri sabitle, ağırlığı kullanılan aralığa daralt
python -m fontTools.varLib.instancer "Fraunces[SOFT,WONK,opsz,wght].ttf" \
  SOFT=0 WONK=1 wght=400:500 -o Fraunces-partial.ttf

python -m fontTools.subset "Inter[opsz,wght].ttf" \
  --unicodes="<latin + latin-ext aralıkları>" --flavor=woff2 \
  --layout-features='*' --output-file=inter-latin.woff2
```

> **`latin-ext` zorunludur.** Atlanırsa ş, ğ, İ, ı gibi Türkçe karakterler
> yedek fonta düşer ve metin gözle görülür biçimde bozulur. Font
> değiştirilirse nöbetçi testler bu kapsamı denetler:
> `tests/guards/fonts.test.ts` (kaynak) ve `tests/e2e/ui.spec.ts` →
> "fontlar" (tarayıcıda, Font Loading API ile).

Optik boyut ekseni (`opsz`) bilerek korundu: tarayıcılar varsayılan olarak
`font-optical-sizing: auto` uygular ve harf biçimleri punto ile incelir.
Sabitlenseydi büyük başlıklar farklı görünürdü.
