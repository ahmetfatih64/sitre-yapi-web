import type { Project } from "./types";

const cover = "/images/stock/project-cover-2.jpg";

export const sitreCesmeResidence: Project = {
  slug: "sitre-cesme-residence",
  name: "Vadi Konutları",
  locationLabel: "Uşak Merkez",
  status: "upcoming",
  tags: ["Residence", "Modern", "Karma kullanım"],
  shortSummary:
    "Şehrin merkezinde, rafine bir residence deneyimi.",
  coverImage: { src: cover, alt: "Vadi Konutları — dış görünüm" },
  meta: {
    title: "Vadi Konutları — Uşak",
    description:
      "Uşak'ta modern bir residence projesi. Mimari dil ve yaşam deneyimi bir arada.",
  },
  hero: {
    overline: "Yakında",
    title: "Vadi Konutları",
    subtitle: "Şehrin kalbinde, huzurlu bir yaşam deneyimi.",
    location: "Uşak Merkez",
    image: { src: cover, alt: "Vadi Konutları hero" },
    primaryCtaLabel: "Size ulaşalım",
  },
  concept: {
    overline: "Mimari fikir",
    title: "Şehrin içinde huzuru yakalayan bir yerleşim.",
    body: [
      "Güneşin eğimini ve rüzgar yönünü analiz ederek başladığımız tasarım, kütleleri manzara için optimize ediyor.",
      "Mat beyaz cephe, modern pencere ritmi ve geniş teraslarla çağdaş bir mimari dil kuruyoruz.",
    ],
    highlights: [
      "Her daire için ferah yaşam alanları",
      "Rüzgar ve güneş analizine dayalı kütle",
      "Geniş teras ve yarı-açık alanlar",
    ],
    image: { src: cover, alt: "Vadi Konutları konsept" },
  },
  location: {
    overline: "Lokasyon",
    title: "Şehrin tam merkezinde.",
    address: "Uşak Merkez",
    coordinates: { lat: 38.6823, lng: 29.4082 },
    body: [
      "Uşak şehir merkezinde; günlük yaşam, eğitim ve ulaşım imkanlarına yürüme mesafesinde.",
    ],
    nearby: [
      { name: "Uşak Merkez", category: "alisveris", distance: "5 dk" },
      { name: "Uşak Devlet Hastanesi", category: "saglik", distance: "9 dk" },
    ],
  },
  features: [
    { label: "Blok sayısı", value: "2" },
    { label: "Daire sayısı", value: "48" },
    { label: "Teslim", value: "2028 Q2" },
    { label: "Yeşil alan oranı", value: "%54" },
    { label: "Otopark", value: "Kapalı" },
    { label: "Konut tipi", value: "Residence" },
  ],
  gallery: {
    overline: "Galeri",
    title: "Mekanları keşfedin.",
    categories: ["Dış", "İç", "Peyzaj"],
    items: [
      { id: "g1", src: "/images/stock/gallery-1.jpg", alt: "Residence dış cephe", category: "Dış" },
      { id: "g2", src: "/images/stock/gallery-2.jpg", alt: "Residence giriş", category: "Dış" },
      { id: "g3", src: "/images/stock/gallery-3.jpg", alt: "Residence salon", category: "İç" },
      { id: "g4", src: "/images/stock/gallery-4.jpg", alt: "Residence mutfak", category: "İç" },
      { id: "g5", src: "/images/stock/gallery-5.jpg", alt: "Residence peyzaj", category: "Peyzaj" },
      { id: "g6", src: "/images/stock/gallery-6.jpg", alt: "Residence teras", category: "İç" },
      { id: "g7", src: "/images/stock/gallery-7.jpg", alt: "Residence gece", category: "Dış" },
      { id: "g8", src: "/images/stock/gallery-8.jpg", alt: "Yaşam alanı detayı", category: "İç" },
    ],
  },
  amenities: {
    overline: "Sosyal olanaklar",
    title: "Yılın 365 günü.",
    items: [
      { name: "Açık ve kapalı havuz" },
      { name: "SPA ve sauna" },
      { name: "Fitness" },
      { name: "Ortak çalışma alanı" },
      { name: "Çocuk oyun alanı" },
      { name: "24 saat güvenlik ve concierge" },
    ],
  },
  siteplan: {
    overline: "Vaziyet planı",
    title: "Yerleşim.",
    image: { src: "/images/placeholders/siteplan.svg", alt: "Vadi Konutları vaziyet planı" },
  },
  plans: {
    overline: "Plan tipleri",
    title: "Daireyi seçin.",
    categories: ["1+1", "2+1", "3+1"],
    items: [
      {
        category: "1+1",
        code: "A-Tipi",
        totalArea: 75,
        netArea: 60,
        rooms: [
          { name: "Salon", area: 28 },
          { name: "Mutfak", area: 8 },
          { name: "Yatak odası", area: 16 },
          { name: "Banyo", area: 6 },
        ],
        orientation: "Batı",
      },
      {
        category: "2+1",
        code: "B-Tipi",
        totalArea: 115,
        netArea: 95,
        rooms: [
          { name: "Salon", area: 36 },
          { name: "Mutfak", area: 12 },
          { name: "Yatak odası 1", area: 18 },
          { name: "Yatak odası 2", area: 14 },
          { name: "Banyo", area: 8 },
        ],
        orientation: "Güney-Batı",
      },
      {
        category: "3+1",
        code: "C-Tipi",
        totalArea: 165,
        netArea: 138,
        rooms: [
          { name: "Salon", area: 48 },
          { name: "Mutfak", area: 16 },
          { name: "Yatak odası 1", area: 22 },
          { name: "Yatak odası 2", area: 16 },
          { name: "Yatak odası 3", area: 14 },
          { name: "Banyo", area: 10 },
        ],
        orientation: "Güney",
      },
    ],
  },
  tour: { available: false },
  bottomCta: {
    title: "Projeyi beraber inceleyelim.",
    description: "Ziyaretinizi planlayalım; sizinle olalım.",
    primaryCtaLabel: "Randevu oluştur",
    secondaryCtaLabel: "Diğer projelerimiz",
  },
};
