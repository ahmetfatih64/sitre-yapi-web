import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { outboxRepo } from "@sitre/db/repos/outbox";
import { dispatch } from "@/lib/outbox/dispatchers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BATCH_SIZE = 25;

function authorized(req: Request): boolean {
  const expected = env.CRON_SECRET;
  if (!expected) return !env.IS_PROD;
  const header = req.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

export async function POST(req: Request): Promise<Response> {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!env.HAS_DB) {
    return NextResponse.json({ ok: true, drained: 0, mode: "no-db" });
  }

  let drained = 0;
  let failed = 0;
  try {
    const batch = await outboxRepo.claimBatch(BATCH_SIZE);
    for (const row of batch) {
      try {
        const result = await dispatch(row.topic, row.payload);
        if (result.ok) {
          await outboxRepo.markSent(row.id);
          drained += 1;
        } else {
          await outboxRepo.markFailed(row.id, result.error, row.attempts + 1);
          failed += 1;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "unknown";
        await outboxRepo.markFailed(row.id, message, row.attempts + 1);
        failed += 1;
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, drained, failed });
}

export async function GET(req: Request): Promise<Response> {
  return POST(req);
}
