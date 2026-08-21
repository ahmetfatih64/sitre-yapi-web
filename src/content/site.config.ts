export const siteConfig = {
  name: "Sitre Yapı",
  tagline: "İyi inşa edilmiş, iyi düşünülmüş mekanlar.",
  description:
    "Sitre Yapı, mimari özen ve uzun vadeli değeri buluşturan bir yapı markasıdır. Konut ve karma kullanımlı projelerle yaşam alanları geliştiriyoruz.",
  url: "https://sitreyapi.example",
  locale: "tr" as const,
  defaultOgImage: "/brand/ana_logo.jpeg",
  founders: [
    { name: "Ahmet Özkan", phone: "+90 507 164 58 92", phoneHref: "tel:+905071645892" },
    { name: "Osman Melih Özkan", phone: "+90 531 641 62 43", phoneHref: "tel:+905316416243" },
  ],
  contact: {
    phone: "+90 507 164 58 92",
    phoneHref: "tel:+905071645892",
    email: "info@sitreyapi.example",
    whatsapp: "+90 507 164 58 92",
    address: {
      street: "Durak Mh. Gülseven Sokak No:1 Kat:1 D:1",
      city: "Uşak",
      postalCode: "64000",
      country: "Türkiye",
      lat: 38.6823,
      lng: 29.4082,
    },
    hours: [
      { label: "Hafta içi", value: "09:00 – 18:00" },
      { label: "Cumartesi", value: "10:00 – 16:00" },
      { label: "Pazar", value: "Kapalı" },
    ],
  },
  social: [
    { platform: "instagram" as const, href: "https://instagram.com/" },
    { platform: "linkedin" as const, href: "https://linkedin.com/" },
    { platform: "youtube" as const, href: "https://youtube.com/" },
  ],
  legal: {
    companyName: "Sitre Yapı Mimarlık Mühendislik",
    taxOffice: "—",
    taxNumber: "—",
  },
};

export type SiteConfig = typeof siteConfig;
