import type { Project } from "./types";

const cover = "/images/stock/project-cover-1.jpg";

export const sitreUrlaKonaklari: Project = {
  slug: "sitre-urla-konaklari",
  name: "Zeytin Bahçe Evleri",
  locationLabel: "Uşak Merkez",
  status: "active",
  tags: ["Konut", "Düşük yoğunluk", "Doğa"],
  shortSummary:
    "Doğayla bütünleşen, düşük yoğunluklu bir konut yerleşkesi.",
  coverImage: { src: cover, alt: "Zeytin Bahçe Evleri — dış görünüm" },
  meta: {
    title: "Zeytin Bahçe Evleri — Uşak",
    description:
      "Uşak'ta düşük yoğunluklu bir konut yerleşkesi. Mimari dil, peyzaj ve uzun vadeli değer bir arada.",
  },
  hero: {
    overline: "Yeni Proje",
    title: "Zeytin Bahçe Evleri",
    subtitle: "Arazinin dilini dinleyen, doğayla bütünleşen bir yaşam.",
    location: "Uşak Merkez",
    image: { src: cover, alt: "Zeytin Bahçe Evleri hero görseli" },
    primaryCtaLabel: "Size ulaşalım",
    secondaryCtaLabel: "Galeriyi incele",
  },
  concept: {
    overline: "Mimari fikir",
    title: "Doğanın kökünden başlayan bir yerleşim.",
    body: [
      "Arazinin eğimli yapısına oturduğumuz ilk andan itibaren konumuz mevcut bitki örtüsünün nasıl korunacağıydı. Kütleleri mevcut ağaçların arasına yerleştirdik; her konak farklı bir manzara ve farklı bir bahçe payı aldı.",
      "Yapılar, bölgenin geleneksel taş doku dilinden esinle, ince detaylı bir modern yoruma oturur. İçeride ışık ve hava akışı için derin saçaklar, yarı-açık avlular ve kesintisiz bir peyzaj sürekliliği öngördük.",
    ],
    highlights: [
      "Doğal dokuyu koruyan düşük yoğunluklu yerleşim",
      "Doğal ışık akışı için derin saçaklar ve iç avlular",
      "Yerel taş dilinin modern yorumla cepheye taşınması",
    ],
    image: { src: cover, alt: "Zeytin Bahçe Evleri — konsept görseli" },
  },
  location: {
    overline: "Lokasyon",
    title: "Şehre yakın, doğaya yaslı.",
    address: "Uşak Merkez",
    coordinates: { lat: 38.6823, lng: 29.4082 },
    body: [
      "Uşak şehir merkezine yakın, doğanın tam ortasında konumlanır.",
    ],
    nearby: [
      { name: "Uşak Merkez", category: "alisveris", distance: "10 dk" },
      { name: "Uşak Devlet Hastanesi", category: "saglik", distance: "12 dk" },
    ],
  },
  features: [
    { label: "Blok sayısı", value: "12 konak" },
    { label: "Daire sayısı", value: "24" },
    { label: "Teslim", value: "2027 Q4" },
    { label: "Yeşil alan oranı", value: "%68" },
    { label: "Otopark", value: "Kapalı" },
    { label: "Konut tipi", value: "Bahçeli konak" },
  ],
  gallery: {
    overline: "Galeri",
    title: "Mekanları keşfedin.",
    categories: ["Dış", "İç", "Peyzaj"],
    items: [
      { id: "g1", src: "/images/stock/gallery-1.jpg", alt: "Dış cephe genel", category: "Dış" },
      { id: "g2", src: "/images/stock/gallery-2.jpg", alt: "Giriş ve bahçe", category: "Dış" },
      { id: "g3", src: "/images/stock/gallery-3.jpg", alt: "Salon ve yaşam alanı", category: "İç" },
      { id: "g4", src: "/images/stock/gallery-4.jpg", alt: "Mutfak detayı", category: "İç" },
      { id: "g5", src: "/images/stock/gallery-5.jpg", alt: "Bahçe ve peyzaj", category: "Peyzaj" },
      { id: "g6", src: "/images/stock/gallery-6.jpg", alt: "Peyzaj detayı", category: "Peyzaj" },
      { id: "g7", src: "/images/stock/gallery-7.jpg", alt: "Gece cephe", category: "Dış" },
      { id: "g8", src: "/images/stock/gallery-8.jpg", alt: "Yatak odası", category: "İç" },
    ],
  },
  amenities: {
    overline: "Sosyal olanaklar",
    title: "Her gün, her mevsim için.",
    items: [
      { name: "Yarı olimpik havuz" },
      { name: "Fitness stüdyosu" },
      { name: "Açık yoga alanı" },
      { name: "Çocuk oyun alanı" },
      { name: "Ortak bahçe ve peyzaj yürüyüş yolu" },
      { name: "Misafir evi" },
    ],
  },
  siteplan: {
    overline: "Vaziyet planı",
    title: "Yerleşim.",
    image: { src: "/images/placeholders/siteplan.svg", alt: "Zeytin Bahçe Evleri vaziyet planı" },
  },
  plans: {
    overline: "Plan tipleri",
    title: "Daireyi seçin.",
    categories: ["3+1", "4+1", "Dubleks"],
    items: [
      {
        category: "3+1",
        code: "A-Tipi",
        totalArea: 180,
        netArea: 150,
        rooms: [
          { name: "Salon", area: 44 },
          { name: "Mutfak", area: 18 },
          { name: "Yatak odası 1", area: 22 },
          { name: "Yatak odası 2", area: 16 },
          { name: "Çalışma", area: 12 },
          { name: "Banyo", area: 8 },
        ],
        orientation: "Güney-Batı",
        floorRange: "Zemin + 1",
      },
      {
        category: "4+1",
        code: "B-Tipi",
        totalArea: 240,
        netArea: 198,
        rooms: [
          { name: "Salon", area: 56 },
          { name: "Mutfak", area: 22 },
          { name: "Yatak odası 1", area: 24 },
          { name: "Yatak odası 2", area: 18 },
          { name: "Yatak odası 3", area: 16 },
          { name: "Çalışma", area: 14 },
          { name: "Banyo", area: 10 },
        ],
        orientation: "Güney",
        floorRange: "Zemin + 1",
      },
      {
        category: "Dubleks",
        code: "C-Tipi",
        totalArea: 320,
        netArea: 268,
        rooms: [
          { name: "Salon", area: 68 },
          { name: "Mutfak", area: 26 },
          { name: "Yatak odası 1", area: 28 },
          { name: "Yatak odası 2", area: 20 },
          { name: "Yatak odası 3", area: 18 },
          { name: "Çatı terası", area: 42 },
        ],
        orientation: "Güney-Doğu",
        floorRange: "Dubleks",
      },
    ],
  },
  progress: {
    overline: "İnşaat durumu",
    title: "Şantiyede neredeyiz?",
    updatedAt: "Ekim 2026",
    milestones: [
      {
        label: "Ruhsat ve izinler",
        status: "done",
        date: "2025 Q2",
        note: "Yapı ruhsatı alındı, imar şartları kesinleşti.",
      },
      {
        label: "Hafriyat ve zemin iyileştirme",
        status: "done",
        date: "2025 Q3",
        note: "Zemin etüdüne göre iyileştirme tamamlandı.",
      },
      { label: "Temel ve bodrum", status: "done", date: "2025 Q4" },
      {
        label: "Kaba yapı (betonarme)",
        status: "active",
        date: "2026 Q2 – 2026 Q4",
        note: "Blokların kat seviyeleri sırayla yükseliyor.",
      },
      { label: "Çatı ve su yalıtımı", status: "planned", date: "2027 Q1" },
      { label: "Cephe ve doğrama", status: "planned", date: "2027 Q2" },
      { label: "İnce yapı ve tesisat", status: "planned", date: "2027 Q2" },
      { label: "Peyzaj ve ortak alanlar", status: "planned", date: "2027 Q3" },
      { label: "Teslim", status: "planned", date: "2027 Q4" },
    ],
  },
  tour: {
    available: true,
    panorama: {
      wide: "/images/tour/panorama-4k.jpg",
      narrow: "/images/tour/panorama-2k.jpg",
      poster: "/images/tour/kapak.jpg",
      posterAlt:
        "Geniş pencereli, aydınlık bir iç mekân; ahşap denizlikte bitkiler",
      initialYaw: 115,
      credit: "Panorama: Poly Haven (CC0) — Sergej Majboroda",
      isConcept: true,
    },
  },
  bottomCta: {
    title: "Projeyi yerinde görmek ister misiniz?",
    description:
      "Ziyaretinizi planlayalım; yerleşimi sizinle beraber gezelim.",
    primaryCtaLabel: "Randevu oluştur",
    secondaryCtaLabel: "Diğer projelerimiz",
  },
};
