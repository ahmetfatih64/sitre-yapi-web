import { NextResponse } from "next/server";
import { getAuthInstance } from "@/lib/auth/instance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Auth.js v5 handler'ı. Örnek src/lib/auth/instance.ts içinde kurulur ve
 * getSession() ile paylaşılır. Yapılandırma eksikse 503 döner; bu durumda
 * geliştirme oturumu tek giriş yoludur (src/lib/auth/session.ts).
 */
function disabled(): Response {
  return NextResponse.json(
    {
      ok: false,
      error: "auth_disabled",
      message:
        "Auth.js yapılandırılmadı (DATABASE_URL, NEXTAUTH_SECRET ve bir e-posta sağlayıcısı gerekli).",
    },
    { status: 503 }
  );
}

export async function GET(req: Request): Promise<Response> {
  const instance = await getAuthInstance();
  if (!instance) return disabled();
  return instance.handlers.GET(req);
}

export async function POST(req: Request): Promise<Response> {
  const instance = await getAuthInstance();
  if (!instance) return disabled();
  return instance.handlers.POST(req);
}
