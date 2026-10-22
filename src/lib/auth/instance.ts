/**
 * Auth.js v5 örneğinin tek kurulum noktası.
 *
 * Hem route handler (`handlers`) hem sunucu tarafı oturum okuma (`auth`)
 * aynı örneği kullanmalı; aksi halde giriş yapılır ama oturum okunamaz.
 * Önceden yalnızca `handlers` kuruluyordu ve `getSession()` üretimde
 * koşulsuz null dönüyordu.
 *
 * Kurulum tembel yapılır: `next-auth` ve `@auth/prisma-adapter` yalnızca
 * DATABASE_URL + NEXTAUTH_SECRET verildiğinde içe aktarılır, böylece
 * veritabanı sağlanmadan da uygulama derlenir ve çalışır.
 */
import { authConfig, isAuthEnabled } from "./nextauth";
import { env } from "@/lib/env";

export interface AuthHandlers {
  GET: (req: Request) => Promise<Response>;
  POST: (req: Request) => Promise<Response>;
}

export interface AuthSessionShape {
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
  } | null;
  expires?: string;
}

interface AuthInstance {
  handlers: AuthHandlers;
  auth: () => Promise<AuthSessionShape | null>;
}

let cached: AuthInstance | null | undefined;

async function build(): Promise<AuthInstance | null> {
  if (!isAuthEnabled) return null;

  try {
    const NextAuth = (await import("next-auth")).default as unknown as (
      cfg: unknown
    ) => AuthInstance;
    const { PrismaAdapter } = (await import("@auth/prisma-adapter")) as {
      PrismaAdapter: (client: unknown) => unknown;
    };
    const { prisma } = await import("@sitre/db");

    const providers: unknown[] = [];
    try {
      const Email = (await import("next-auth/providers/nodemailer"))
        .default as unknown as (cfg: unknown) => unknown;

      /**
       * SMTP ayarı iki kaynaktan gelebilir:
       *  - EMAIL_SERVER_* : genel SMTP (yerel yakalayıcı, farklı satıcı)
       *  - POSTMARK_*     : üretim varsayılanı
       * Genel ayar verilmişse o kazanır.
       */
      const smtp = env.EMAIL_SERVER_HOST
        ? {
            host: env.EMAIL_SERVER_HOST,
            port: env.EMAIL_SERVER_PORT ?? 587,
            // Yerel yakalayıcılar kimlik doğrulaması istemez.
            ...(env.EMAIL_SERVER_USER
              ? {
                  auth: {
                    user: env.EMAIL_SERVER_USER,
                    pass: env.EMAIL_SERVER_PASSWORD ?? "",
                  },
                }
              : {}),
            secure: false,
            ignoreTLS: !env.EMAIL_SERVER_USER,
          }
        : env.POSTMARK_SERVER_TOKEN
          ? {
              host: "smtp.postmarkapp.com",
              port: 587,
              auth: {
                user: env.POSTMARK_SERVER_TOKEN,
                pass: env.POSTMARK_SERVER_TOKEN,
              },
            }
          : null;

      const from = env.EMAIL_FROM ?? env.POSTMARK_FROM;

      if (smtp && from) {
        providers.push(Email({ server: smtp, from }));
      }
    } catch {
      // E-posta sağlayıcısı opsiyonel.
    }

    if (providers.length === 0) {
      console.warn(
        "[auth] hiçbir sağlayıcı yapılandırılmadı — POSTMARK_SERVER_TOKEN ve POSTMARK_FROM gerekli."
      );
      return null;
    }

    return NextAuth({
      ...authConfig,
      adapter: PrismaAdapter(prisma),
      providers,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "bilinmeyen";
    console.warn("[auth] kurulum başarısız:", message);
    return null;
  }
}

/** Örneği bir kez kurar; sonraki çağrılar önbellekten döner. */
export async function getAuthInstance(): Promise<AuthInstance | null> {
  if (cached !== undefined) return cached;
  cached = await build();
  return cached;
}
