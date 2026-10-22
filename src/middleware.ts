import { NextRequest, NextResponse } from "next/server";
import { buildCsp } from "@sitre/security";
import { lookupRedirect } from "@/lib/security/redirects";

const isProd = process.env.NODE_ENV === "production";

/**
 * Her istekte sunucuda render edilen rotalar. Yalnızca bunlar nonce'lu
 * katı politikayı alabilir; statik üretilen sayfalar alamaz.
 *
 * Bir sayfaya `export const dynamic = "force-dynamic"` eklenirse yolunu
 * buraya da eklemek gerekir, aksi halde gereğinden zayıf politika alır.
 */
const DYNAMIC_PREFIXES = ["/admin", "/api"] as const;

function isDynamicRoute(pathname: string): boolean {
  return DYNAMIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

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

  const requestHeaders = new Headers(req.headers);
  let csp: string;

  if (isDynamicRoute(pathname)) {
    // Bu rotalar her istekte sunucuda render edilir, dolayısıyla istek
    // başına üretilen nonce script etiketlerine basılabilir.
    const nonce = generateNonce();
    csp = buildCsp({ nonce, isDev: !isProd, mode: "nonce" });
    /**
     * Next.js nonce'u yalnızca İSTEK üzerindeki `Content-Security-Policy`
     * başlığından okur ve kendi <script> etiketlerine onu basar. Bu satır
     * olmadan script'ler nonce'suz üretilir ve `strict-dynamic` varken
     * `'self'` yok sayıldığı için tarayıcı hepsini engeller.
     */
    requestHeaders.set("Content-Security-Policy", csp);
  } else {
    // Herkese açık sayfalar build sırasında statik üretilir. Next.js RSC
    // verisini o HTML'e satır içi <script> olarak gömer ve bunlara istek
    // nonce'u basılamaz, dolayısıyla nonce'lu politika bu sayfalarda tüm
    // JavaScript'i engeller. Bu rotalarda kullanıcı üretimi HTML
    // render edilmediği için satır içi script'e izin vermek kabul edilebilir.
    csp = buildCsp({ isDev: !isProd, mode: "static" });
  }

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
