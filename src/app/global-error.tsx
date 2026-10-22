/* eslint-disable @next/next/no-html-link-for-pages --
 * Kök layout çöktüğünde uygulama kabuğu bozuk demektir. next/link ile yumuşak
 * gezinme aynı bozuk ağaca döner; tam sayfa yenileme kasıtlı tercihtir.
 */
"use client";

/**
 * Kök layout'un kendisi çökerse devreye girer. Bu durumda layout render
 * edilmediği için kendi <html>/<body> etiketlerini ve stillerini taşımalı;
 * global CSS'e güvenilemez.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#14100d",
          color: "#ece8e3",
          fontFamily: "Inter, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#d4a843",
              margin: 0,
            }}
          >
            Sitre Yapı
          </p>
          <h1
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              lineHeight: 1.2,
              margin: "1.25rem 0 0",
              color: "#fff",
            }}
          >
            Beklenmeyen bir hata oluştu.
          </h1>
          <p style={{ margin: "1rem 0 0", lineHeight: 1.6, color: "rgba(255,255,255,0.7)" }}>
            Sayfayı yeniden yüklemeyi deneyin. Sorun sürerse bize
            ulaşabilirsiniz.
          </p>

          <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.9rem 1.6rem",
                border: "1px solid #fff",
                background: "#fff",
                color: "#2b2a28",
                font: "inherit",
                fontSize: 14,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Tekrar dene
            </button>
            <a
              href="/"
              style={{
                padding: "0.9rem 1.6rem",
                border: "1px solid rgba(255,255,255,0.5)",
                color: "#fff",
                textDecoration: "none",
                fontSize: 14,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Ana sayfa
            </a>
          </div>

          {error.digest ? (
            <p style={{ marginTop: "2.5rem", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
              Hata kodu: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
