"use client";

import { useState } from "react";
import { useConsent } from "@/lib/consent/provider";

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
 *
 * Gömülü harita üçüncü tarafa (Google / OpenStreetMap) istek attığı ve
 * çerez bırakabildiği için pazarlama onayı verilmeden yüklenmez. Onay yoksa
 * kullanıcı tek tıkla kendisi başlatır; bu tercih yalnızca o görünüm için
 * geçerlidir, kalıcı bir onay yerine geçmez.
 */
export function EmbedMap({
  lat,
  lng,
  label,
  query,
  zoom = 16,
  className,
}: EmbedMapProps) {
  const { state, reopen } = useConsent();
  const [manuallyLoaded, setManuallyLoaded] = useState(false);
  const allowed = state.marketing || manuallyLoaded;

  const src = query
    ? `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`
    : (() => {
        const delta = 0.01;
        const bbox = [lng - delta, lat - delta / 2, lng + delta, lat + delta / 2].join(",");
        return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
      })();

  const gmapsHref = query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const provider = query ? "Google Maps" : "OpenStreetMap";

  return (
    <div
      className={
        "relative w-full aspect-[4/3] md:aspect-[16/10] border border-[var(--color-border)] bg-[var(--color-bg-alt)] overflow-hidden " +
        (className ?? "")
      }
    >
      {allowed ? (
        <>
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
            Google Maps&apos;te aç →
          </a>
        </>
      ) : (
        <div className="map-consent">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden
            className="text-[var(--color-accent-ink)]"
          >
            <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>

          <p className="map-consent__label">{label}</p>
          <p className="map-consent__note">
            Harita {provider} üzerinden yüklenir ve tarayıcınıza çerez
            bırakabilir. Yüklemek için onayınız gerekiyor.
          </p>

          <div className="map-consent__actions">
            <button
              type="button"
              onClick={() => setManuallyLoaded(true)}
              className="btn btn-primary"
            >
              Haritayı yükle
            </button>
            <a
              href={gmapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Google Maps&apos;te aç →
            </a>
          </div>

          <button
            type="button"
            onClick={reopen}
            className="map-consent__prefs"
          >
            Çerez tercihlerini değiştir
          </button>
        </div>
      )}

      <span className="sr-only">
        {label} — koordinat {lat}, {lng}, yakınlaştırma {zoom}
      </span>
    </div>
  );
}
