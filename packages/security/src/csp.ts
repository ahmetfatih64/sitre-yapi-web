/**
 * Content-Security-Policy builder. Shared between the public web app
 * and (future) admin app so security policy stays single-sourced.
 */
/**
 * Hangi script politikasinin uretilecegi.
 *
 * - `nonce`: nonce + `strict-dynamic`. Guclu politika, ancak nonce istek
 *   basina uretildigi icin YALNIZCA dinamik render edilen rotalarda
 *   calisir. Onceden uretilmis (statik) HTML'e istek nonce'u basilamaz.
 * - `static`: `'self' 'unsafe-inline'`. Next.js statik HTML'e RSC verisini
 *   satir ici <script> olarak gomer ve bunlar nonce tasiyamaz; bu mod o
 *   sayfalar icin gereklidir.
 *
 * `strict-dynamic` varliginda tarayici `'self'` kaynagini YOK SAYAR; bu
 * yuzden iki mod karistirilamaz, rotaya gore secilmelidir.
 */
export type CspMode = "nonce" | "static";

export interface CspOptions {
  /** `nonce` modunda zorunlu; `static` modda kullanilmaz. */
  nonce?: string;
  isDev: boolean;
  mode?: CspMode;
  /** Extra origins per directive (for app-specific exceptions). */
  extra?: Partial<Record<CspDirective, string[]>>;
}

export type CspDirective =
  | "default-src"
  | "script-src"
  | "style-src"
  | "img-src"
  | "font-src"
  | "connect-src"
  | "frame-src"
  | "media-src"
  | "worker-src"
  | "manifest-src"
  | "form-action"
  | "frame-ancestors"
  | "object-src"
  | "base-uri";

export function buildCsp({
  nonce,
  isDev,
  mode = "nonce",
  extra,
}: CspOptions): string {
  const self = "'self'";

  // Nonce unutulursa sessizce zayif bir politika uretmek yerine basarisiz ol.
  if (mode === "nonce" && !nonce) {
    throw new Error("buildCsp: 'nonce' modunda nonce zorunludur");
  }

  const scriptSrc = [
    self,
    ...(mode === "nonce"
      ? [`'nonce-${nonce}'`, "'strict-dynamic'"]
      : ["'unsafe-inline'"]),
    isDev ? "'unsafe-eval'" : "",
    "https://challenges.cloudflare.com",
    ...(extra?.["script-src"] ?? []),
  ].filter(Boolean);

  const directives: Record<string, string[]> = {
    "default-src": [self, ...(extra?.["default-src"] ?? [])],
    "base-uri": [self],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    "form-action": [self, ...(extra?.["form-action"] ?? [])],
    "script-src": scriptSrc,
    "style-src": [self, "'unsafe-inline'", ...(extra?.["style-src"] ?? [])],
    "img-src": [self, "data:", "blob:", "https:", ...(extra?.["img-src"] ?? [])],
    "font-src": [self, "data:", ...(extra?.["font-src"] ?? [])],
    "connect-src": [
      self,
      "https://challenges.cloudflare.com",
      ...(isDev ? ["ws://localhost:*", "http://localhost:*"] : []),
      ...(extra?.["connect-src"] ?? []),
    ],
    "frame-src": [
      self,
      "https://www.google.com",
      "https://maps.google.com",
      "https://www.openstreetmap.org",
      "https://challenges.cloudflare.com",
      ...(extra?.["frame-src"] ?? []),
    ],
    "media-src": [self, "blob:", "data:", ...(extra?.["media-src"] ?? [])],
    "worker-src": [self, "blob:", ...(extra?.["worker-src"] ?? [])],
    "manifest-src": [self],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([k, v]) => (v.length ? `${k} ${v.join(" ")}` : k))
    .join("; ");
}
