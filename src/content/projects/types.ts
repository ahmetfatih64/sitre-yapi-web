export type ProjectStatus = "active" | "completed" | "upcoming";

export const statusLabel: Record<ProjectStatus, string> = {
  active: "Aktif Satış",
  completed: "Tamamlandı",
  upcoming: "Yakında",
};

export type NearbyCategory =
  | "okul"
  | "saglik"
  | "alisveris"
  | "ulasim"
  | "sosyal"
  | "doga";

export type Project = {
  slug: string;
  name: string;
  locationLabel: string;
  status: ProjectStatus;
  tags: string[];
  shortSummary: string;
  coverImage: { src: string; alt: string };
  meta: {
    title: string;
    description: string;
    ogImage?: string;
  };
  hero: {
    overline: string;
    title: string;
    subtitle: string;
    location: string;
    image: { src: string; alt: string };
    primaryCtaLabel: string;
    secondaryCtaLabel?: string;
  };
  concept: {
    overline: string;
    title: string;
    body: string[];
    highlights: string[];
    image: { src: string; alt: string };
  };
  location: {
    overline: string;
    title: string;
    address: string;
    coordinates: { lat: number; lng: number };
    body: string[];
    nearby: { name: string; category: NearbyCategory; distance: string }[];
  };
  features: { label: string; value: string }[];
  gallery: {
    overline: string;
    title: string;
    categories: string[];
    items: { id: string; src: string; alt: string; category: string; caption?: string }[];
  };
  amenities: {
    overline: string;
    title: string;
    items: { name: string; description?: string }[];
  };
  siteplan: {
    overline: string;
    title: string;
    image: { src: string; alt: string };
  };
  plans: {
    overline: string;
    title: string;
    categories: string[];
    items: {
      category: string;
      code: string;
      /**
       * Gercek mimari plan cizimi. Verilmezse plan `rooms` alanlarindan
       * sematik olarak uretilir; musteri kendi cizimlerini verdiginde
       * bu alan doldurulup uretilen sema devre disi kalir.
       */
      image?: { src: string; alt: string };
      totalArea: number;
      netArea: number;
      rooms: { name: string; area: number }[];
      orientation?: string;
      floorRange?: string;
    }[];
  };
  /**
   * İnşaat ilerlemesi. Yüzde burada tutulmaz; aşamalardan hesaplanır
   * (`src/lib/progress.ts`), böylece aşamalar güncellenince yüzde
   * kendiliğinden doğru kalır.
   */
  progress?: {
    overline: string;
    title: string;
    /** Verinin en son ne zaman doğrulandığı; vitrinde gösterilir. */
    updatedAt?: string;
    milestones: {
      label: string;
      status: "done" | "active" | "planned";
      date?: string;
      note?: string;
    }[];
  };
  tour?: {
    available: boolean;
    /**
     * Harici 360° tur (ör. Matterport) gömme adresi. Üçüncü tarafa istek
     * gittiği için pazarlama onayına bağlı yüklenir. `panorama` verilmişse
     * o önceliklidir.
     */
    embedUrl?: string;
    /** Kendi sunucumuzdan servis edilen eşdikdörtgen panorama. */
    panorama?: {
      wide: string;
      narrow: string;
      poster: string;
      posterAlt: string;
      initialYaw?: number;
      credit?: string;
      /** Temsilî görselse arayüzde açıkça belirtilir. */
      isConcept?: boolean;
    };
  };
  bottomCta: {
    title: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
};
