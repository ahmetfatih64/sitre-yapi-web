import { NextResponse } from "next/server";
import { ingestLead } from "@/lib/leads/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: Request): string | null {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || null;
  return (
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    h.get("true-client-ip") ||
    null
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "İstek gövdesi okunamadı." },
      { status: 400 }
    );
  }

  const result = await ingestLead({
    rawBody: body,
    ip: clientIp(req),
    userAgent: req.headers.get("user-agent"),
    idempotencyKey: req.headers.get("idempotency-key"),
  });

  if (!result.ok) {
    const status =
      result.code === "rate_limited"
        ? 429
        : result.code === "challenge_failed"
          ? 403
          : result.code === "invalid" || result.code === "honeypot"
            ? 400
            : 500;
    return NextResponse.json(
      { ok: false, error: result.message, code: result.code },
      { status }
    );
  }

  return NextResponse.json({ ok: true, id: result.id, deduped: result.deduped });
}
