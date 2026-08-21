/**
 * Content-Security-Policy builder. Shared between the public web app
 * and (future) admin app so security policy stays single-sourced.
 */
export interface CspOptions {
  nonce: string;
  isDev: boolean;
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

export function buildCsp({ nonce, isDev, extra }: CspOptions): string {
  const self = "'self'";
  const scriptSrc = [
    self,
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
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
