/**
 * Server-side session lookup. Wraps the auth provider so route handlers
 * stay decoupled from the concrete library (Auth.js v5 today, swap later).
 *
 * In dev mode (no DATABASE_URL / NEXTAUTH_SECRET) this returns a synthetic
 * session keyed by the `x-dev-actor` cookie so the admin UI is exercisable
 * without provisioning auth. NEVER ships in production: gated on env.
 */
import type { Role } from "@sitre/auth";
import { env } from "@/lib/env";
import { cookies } from "next/headers";

export interface AuthSession {
  user: { id: string; email: string; name: string | null; role: Role };
  expires: string;
}

const DEV_ACTORS: Record<string, AuthSession["user"]> = {
  owner: { id: "dev-owner", email: "owner@dev.local", name: "Dev Owner", role: "OWNER" },
  admin: { id: "dev-admin", email: "admin@dev.local", name: "Dev Admin", role: "ADMIN" },
  editor: { id: "dev-editor", email: "editor@dev.local", name: "Dev Editor", role: "EDITOR" },
  sales: { id: "dev-sales", email: "sales@dev.local", name: "Dev Sales", role: "SALES" },
};

export async function getSession(): Promise<AuthSession | null> {
  if (!env.IS_PROD) {
    const jar = await cookies();
    const key = jar.get("x-dev-actor")?.value ?? "owner";
    const user = DEV_ACTORS[key];
    if (!user) return null;
    return {
      user,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }


  return null;
}

export async function requireSession(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}
