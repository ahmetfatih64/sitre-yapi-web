# FORMS_AND_MODAL_SPEC — Form ve modal davranış şartnamesi

## 1. Ana iletişim formu (`/iletisim`)
Alanlar (hepsi görünür label):
- Ad Soyad * (min 2, max 80)
- Telefon * (TR formatı, intl tel-input opsiyonel)
- E-posta * (RFC)
- Konu (select: Genel / Proje bilgisi / Basın / Kariyer)
- İlgilendiğiniz proje (select: projelerden + "Belirtmedim")
- Mesajınız (opsiyonel, max 1000)
- KVKK * (checkbox, onaylanmadan submit yok)
- Honeypot alan: `website` (gizli, dolarsa drop)

Davranış:
- Client validation RHF + Zod
- Submit → `/api/contact` POST (server validasyonu aynı şema)
- Loading state (button disabled + spinner)
- Success: inline mesaj, form reset
- Error: inline mesaj, veri korunur

## 2. Quick contact modal
- Her yerden açılabilir (`?contact=open` query + event)
- İçerik: ad, tel, e-posta, (opsiyonel) plan tipi, KVKK
- Escape ile kapanır, focus trap aktif, body scroll kilidi
- Mobile'da bottom sheet görünümü
- Açıldığında ilk input'a focus

## 3. Erişilebilirlik
- Tüm alanlar `<label for>` ile bağlı
- Hata `aria-describedby` + `aria-invalid="true"`
- Toplu hata özeti `role="alert"` ile üstte
- Submit butonu `aria-busy` loading'de

## 4. KVKK onayı
- Label: "KVKK Aydınlatma Metni'ni okudum, kişisel verilerimin işlenmesini kabul ediyorum."
- Link: `/kvkk` — yeni sekmede

## 5. Spam koruması
- Honeypot (varsayılan)
- reCAPTCHA v3 opsiyonel (env varsa aktif)
