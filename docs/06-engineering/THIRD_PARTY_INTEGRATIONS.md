# THIRD_PARTY_INTEGRATIONS — Üçüncü parti servisler ve env

Her servis `.env.local` üzerinden gelir. Repoya canlı key commit edilmez.

| Amaç | Servis | Env anahtarları |
|---|---|---|
| Site URL | — | `NEXT_PUBLIC_SITE_URL` |
| Analitik | GA4 | `NEXT_PUBLIC_GA_ID` |
| Spam | reCAPTCHA v3 | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` |
| Form backend | Resend / SMTP / webhook | `FORM_BACKEND`, `FORM_BACKEND_KEY`, `FORM_TO_EMAIL` |
| Harita | Google Maps veya Mapbox | `MAP_PROVIDER`, `MAP_API_KEY` |

## .env.example
```
NEXT_PUBLIC_SITE_URL=https://sitreyapi.example
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
FORM_BACKEND=resend
FORM_BACKEND_KEY=
FORM_TO_EMAIL=info@sitreyapi.example
MAP_PROVIDER=google
MAP_API_KEY=
```

## Yükleme stratejisi
- GA4: consent sonrası, `next/script` `afterInteractive`
- reCAPTCHA: form interaction anında lazy yükle
- Harita: section görünür olunca IntersectionObserver ile yükle
