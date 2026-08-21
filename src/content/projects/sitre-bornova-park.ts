import type { Project } from "./types";

const cover = "/images/stock/project-cover-3.jpg";

export const sitreBornovaPark: Project = {
  slug: "sitre-bornova-park",
  name: "Yeşilvadi Konutları",
  locationLabel: "Uşak Merkez",
  status: "completed",
  tags: ["Konut", "Şehir", "Teslim edildi"],
  shortSummary:
    "Şehir merkezinde, yeşil alanla çevrili, teslim edilmiş bir konut projesi.",
  coverImage: { src: cover, alt: "Yeşilvadi Konutları — dış görünüm" },
  meta: {
    title: "Yeşilvadi Konutları — Uşak",
    description:
      "Uşak merkezinde, geniş peyzaj alanlarıyla tamamlanmış bir konut projesi.",
  },
  hero: {
    overline: "Tamamlandı",
    title: "Yeşilvadi Konutları",
    subtitle: "Şehrin içinde nefes alan bir konut yerleşkesi.",
    location: "Uşak Merkez",
    image: { src: cover, alt: "Yeşilvadi Konutları hero" },
    primaryCtaLabel: "Bilgi alın",
  },
  concept: {
    overline: "Mimari fikir",
    title: "Yoğun şehir dokusunun içinde bir boşluk.",
    body: [
      "Şehrin yoğun dokusunda, proje tabanının önemli bir kısmını açık yeşil alana ayırarak başladık. Yapılar bu boşluğu çerçeveler.",
      "Cephe, minimum detayla ve doğal tonlarla sakin bir görünüm sunar; merkezde bir sükunet adası kurar.",
    ],
    highlights: [
      "Taban alanının önemli bir kısmı peyzaja ayrılmış",
      "Doğal tonlu, sakin cephe dili",
      "Merkeze yürüme mesafesi",
    ],
    image: { src: cover, alt: "Yeşilvadi Konutları konsept" },
  },
  location: {
    overline: "Lokasyon",
    title: "Şehrin nabzına yakın.",
    address: "Uşak Merkez",
    coordinates: { lat: 38.6823, lng: 29.4082 },
    body: [
      "Uşak şehir merkezinde; sosyal yaşam, eğitim ve ulaşım imkanları yürüme mesafesinde.",
    ],
    nearby: [
      { name: "Uşak Merkez", category: "alisveris", distance: "5 dk" },
      { name: "Uşak Devlet Hastanesi", category: "saglik", distance: "10 dk" },
    ],
  },
  features: [
    { label: "Blok sayısı", value: "4" },
    { label: "Daire sayısı", value: "128" },
    { label: "Teslim", value: "Teslim edildi (2024)" },
    { label: "Yeşil alan oranı", value: "%52" },
    { label: "Otopark", value: "Kapalı" },
    { label: "Konut tipi", value: "Konut" },
  ],
  gallery: {
    overline: "Galeri",
    title: "Teslim edilmiş mekanlar.",
    categories: ["Dış", "İç", "Peyzaj"],
    items: [
      { id: "g1", src: "/images/stock/gallery-1.jpg", alt: "Dış cephe", category: "Dış" },
      { id: "g2", src: "/images/stock/gallery-2.jpg", alt: "Giriş", category: "Dış" },
      { id: "g3", src: "/images/stock/gallery-3.jpg", alt: "Salon", category: "İç" },
      { id: "g4", src: "/images/stock/gallery-4.jpg", alt: "Mutfak", category: "İç" },
      { id: "g5", src: "/images/stock/gallery-5.jpg", alt: "Peyzaj ve yürüyüş yolu", category: "Peyzaj" },
      { id: "g6", src: "/images/stock/gallery-6.jpg", alt: "Ortak alan", category: "İç" },
      { id: "g7", src: "/images/stock/gallery-7.jpg", alt: "Gece cephe", category: "Dış" },
      { id: "g8", src: "/images/stock/gallery-8.jpg", alt: "Yatak odası", category: "İç" },
    ],
  },
  amenities: {
    overline: "Sosyal olanaklar",
    title: "Komşuluk için.",
    items: [
      { name: "Açık havuz" },
      { name: "Fitness" },
      { name: "Çocuk oyun alanı" },
      { name: "Ortak çalışma alanı" },
      { name: "Ortak bahçe" },
      { name: "Bisiklet park" },
    ],
  },
  siteplan: {
    overline: "Vaziyet planı",
    title: "Yerleşim.",
    image: { src: "/images/placeholders/siteplan.svg", alt: "Yeşilvadi Konutları vaziyet planı" },
  },
  plans: {
    overline: "Plan tipleri",
    title: "Daireyi seçin.",
    categories: ["2+1", "3+1"],
    items: [
      {
        category: "2+1",
        code: "A-Tipi",
        image: { src: "/images/placeholders/plan-a.svg", alt: "A-Tipi 2+1" },
        totalArea: 105,
        netArea: 88,
        rooms: [
          { name: "Salon", area: 32 },
          { name: "Mutfak", area: 10 },
          { name: "Yatak odası 1", area: 18 },
          { name: "Yatak odası 2", area: 14 },
          { name: "Banyo", area: 8 },
        ],
      },
      {
        category: "3+1",
        code: "B-Tipi",
        image: { src: "/images/placeholders/plan-b.svg", alt: "B-Tipi 3+1" },
        totalArea: 145,
        netArea: 122,
        rooms: [
          { name: "Salon", area: 42 },
          { name: "Mutfak", area: 14 },
          { name: "Yatak odası 1", area: 20 },
          { name: "Yatak odası 2", area: 16 },
          { name: "Yatak odası 3", area: 14 },
          { name: "Banyo", area: 10 },
        ],
      },
    ],
  },
  tour: { available: false },
  bottomCta: {
    title: "Projeyi incelemek ister misiniz?",
    description: "Teslim edilmiş alanları birlikte gezebiliriz.",
    primaryCtaLabel: "Randevu oluştur",
    secondaryCtaLabel: "Diğer projelerimiz",
  },
};
