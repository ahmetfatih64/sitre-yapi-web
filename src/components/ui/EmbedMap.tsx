interface EmbedMapProps {
  lat: number;
  lng: number;
  label: string;
  /**
   * Opsiyonel adres metni. Verilirse Google Maps'in adres araması
   * kullanılır; koordinat tabanlı OSM embed'inden daha doğru pin verir.
   */
  query?: string;
  zoom?: number;
  className?: string;
}

/**
 * API key gerektirmeyen iframe harita.
 * - `query` verilirse: Google Maps adres araması
 * - yoksa: OpenStreetMap bbox + marker
 */
export function EmbedMap({
  lat,
  lng,
  label,
  query,
  zoom = 16,
  className,
}: EmbedMapProps) {
  let src: string;
  if (query) {
    src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
  } else {
    const delta = 0.01;
    const bbox = [
      lng - delta,
      lat - delta / 2,
      lng + delta,
      lat + delta / 2,
    ].join(",");
    src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  }
  const gmapsHref = query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div
      className={
        "relative w-full aspect-[4/3] md:aspect-[16/10] border border-[var(--color-border)] bg-[var(--color-bg-alt)] overflow-hidden " +
        (className ?? "")
      }
    >
      <iframe
        title={`Harita: ${label}`}
        src={src}
        className="absolute inset-0 w-full h-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0 }}
      />
      <a
        href={gmapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-[0.14em] border border-[var(--color-border)] hover:bg-white transition-colors"
      >
        Google Maps'te aç →
      </a>
      <span className="sr-only">
        {label} — koordinat {lat}, {lng}, yakınlaştırma {zoom}
      </span>
    </div>
  );
}
