import { NextRequest, NextResponse } from "next/server";
import { buildCsp } from "@sitre/security";
import { lookupRedirect } from "@/lib/security/redirects";

const isProd = process.env.NODE_ENV === "production";

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const redirect = lookupRedirect(pathname);
  if (redirect) {
    const url = req.nextUrl.clone();
    url.pathname = redirect.to;
    return NextResponse.redirect(url, redirect.statusCode);
  }

  const nonce = generateNonce();
  const csp = buildCsp({ nonce, isDev: !isProd });

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-csp", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  res.headers.set("X-DNS-Prefetch-Control", "on");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  if (isProd) {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image, favicon, public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|brand/|images/|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|mp4|webm|woff2?|ttf|otf|css|js|map|txt|xml)).*)",
  ],
};
