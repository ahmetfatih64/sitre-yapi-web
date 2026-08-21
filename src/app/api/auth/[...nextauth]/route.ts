import { NextResponse } from "next/server";
import { isAuthEnabled, authConfig } from "@/lib/auth/nextauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Auth.js v5 handler. Activates only when DATABASE_URL + NEXTAUTH_SECRET are
 * present AND `next-auth` / `@auth/prisma-adapter` packages are installed.
 * Otherwise we serve a 503 so dev session cookies remain the only entry point.
 */

function disabled(reason: string): Response {
  return NextResponse.json(
    { ok: false, error: "auth_disabled", message: reason },
    { status: 503 }
  );
}

type Handlers = { GET: (req: Request) => Promise<Response>; POST: (req: Request) => Promise<Response> };

let cached: Handlers | null | undefined;

async function loadHandlers(): Promise<Handlers | null> {
  if (cached !== undefined) return cached;
  if (!isAuthEnabled) {
    cached = null;
    return null;
  }
  try {
    const NextAuth = (await import("next-auth")).default as unknown as (
      cfg: unknown
    ) => { handlers: Handlers };
    const { PrismaAdapter } = (await import("@auth/prisma-adapter")) as {
      PrismaAdapter: (client: unknown) => unknown;
    };
    const { prisma } = await import("@sitre/db");

    const providers: unknown[] = [];
    try {
      const Email = (await import("next-auth/providers/nodemailer")).default as unknown as (
        cfg: unknown
      ) => unknown;
      if (process.env.POSTMARK_SERVER_TOKEN && process.env.POSTMARK_FROM) {
        providers.push(
          Email({
            server: {
              host: "smtp.postmarkapp.com",
              port: 587,
              auth: {
                user: process.env.POSTMARK_SERVER_TOKEN,
                pass: process.env.POSTMARK_SERVER_TOKEN,
              },
            },
            from: process.env.POSTMARK_FROM,
          })
        );
      }
    } catch {
      // Email provider optional
    }

    const { handlers } = NextAuth({
      ...authConfig,
      adapter: PrismaAdapter(prisma),
      providers,
    });
    cached = handlers;
    return handlers;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    console.warn("[auth] handler load failed:", message);
    cached = null;
    return null;
  }
}

export async function GET(req: Request): Promise<Response> {
  const h = await loadHandlers();
  if (!h) return disabled("Auth.js not configured (DATABASE_URL + NEXTAUTH_SECRET required).");
  return h.GET(req);
}

export async function POST(req: Request): Promise<Response> {
  const h = await loadHandlers();
  if (!h) return disabled("Auth.js not configured (DATABASE_URL + NEXTAUTH_SECRET required).");
  return h.POST(req);
}
