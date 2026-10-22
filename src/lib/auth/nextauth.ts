/**
 * Auth.js v5 configuration. Activates only when DATABASE_URL + NEXTAUTH_SECRET
 * are provided. Until then, the route handler returns 503 so admin runs in
 * dev-session mode (see src/lib/auth/session.ts).
 *
 * Add real providers (Passkey + Email magic-link + TOTP) once the DB is
 * provisioned. The shape below mirrors Auth.js v5 NextAuthConfig.
 */
import type { NextAuthConfig } from "./types";
import { env } from "@/lib/env";

export const isAuthEnabled = env.HAS_AUTH;

export const authConfig: NextAuthConfig = {
  // Kanonik köken NEXTAUTH_URL ile sabitlenir; ters vekil sunucunun doğru
  // Host/X-Forwarded-Host başlığı geçirmesi dağıtımın sorumluluğundadır.
  // Bu olmadan kendi sunucunda barındırılan her kurulumda giriş 500 verir.
  trustHost: true,
  session: { strategy: "database", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith("/admin");
      if (!isAdmin) return true;
      return Boolean(auth?.user);
    },
    session({ session, user }) {

      if (session.user && user) {
        (session.user as { role?: string }).role =
          (user as { role?: string }).role ?? "VIEWER";
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {

      if (env.IS_PROD) console.warn("[auth] sign-in", { userId: user?.id });
    },
  },
  // Providers are appended at runtime in handler.ts so this module stays
  // serializable for edge middleware authorization checks.
  providers: [],
};
