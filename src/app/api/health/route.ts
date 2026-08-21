import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  return NextResponse.json({
    ok: true,
    ts: new Date().toISOString(),
    env: {
      isProd: env.IS_PROD,
      hasDb: env.HAS_DB,
      hasAuth: env.HAS_AUTH,
      hasR2: env.HAS_R2,
      hasPostmark: env.HAS_POSTMARK,
      hasUpstash: env.HAS_UPSTASH,
      hasTurnstile: env.HAS_TURNSTILE,
      hasCrm: env.HAS_CRM,
    },
  });
}
