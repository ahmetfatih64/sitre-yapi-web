import { contactSchema } from "@/lib/forms/schema";
import { rateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { buildDedupeHash, sha256 } from "./hash";
import { emitLeadReceived } from "./outbox";
import { CURRENT_CONSENT_POLICY_VERSION } from "@/lib/consent/policy";
import { env } from "@/lib/env";
import { leadRepo } from "@sitre/db/repos/lead";

const LEAD_SOURCES = ["WEB_FORM", "PHONE", "WHATSAPP", "REFERRAL", "CAMPAIGN", "OTHER"] as const;
function normalizeSource(source: string | null | undefined): string {
  if (!source) return "WEB_FORM";
  const upper = source.toUpperCase();
  return (LEAD_SOURCES as readonly string[]).includes(upper) ? upper : "OTHER";
}
import type {
  LeadIngestResult,
  LeadRecord,
} from "./types";

const IP_LIMIT = { limit: 5, windowMs: 60_000 };
const IP_HOURLY = { limit: 20, windowMs: 60 * 60_000 };

/** In-memory dedupe store; Redis-backed in production when Upstash is wired. */
const recentHashes = new Map<string, { id: string; at: number }>();
const DEDUPE_TTL = 10 * 60_000;

export async function ingestLead(input: {
  rawBody: unknown;
  ip: string | null;
  userAgent: string | null;
  idempotencyKey: string | null;
}): Promise<LeadIngestResult> {
  const parsed = contactSchema.safeParse(input.rawBody);
  if (!parsed.success) {
    return {
      ok: false,
      code: "invalid",
      message: "Form verisi geçersiz.",
    };
  }
  const data = parsed.data;

  if (data.website && data.website.length > 0) {
    return { ok: false, code: "honeypot", message: "blocked" };
  }

  const ipKey = input.ip ?? "anon";
  const minuteGate = await rateLimit(
    `lead:m:${ipKey}`,
    IP_LIMIT.limit,
    IP_LIMIT.windowMs
  );
  if (!minuteGate.allowed) {
    return {
      ok: false,
      code: "rate_limited",
      message: "Çok fazla istek — lütfen birkaç dakika sonra tekrar deneyin.",
    };
  }
  const hourGate = await rateLimit(
    `lead:h:${ipKey}`,
    IP_HOURLY.limit,
    IP_HOURLY.windowMs
  );
  if (!hourGate.allowed) {
    return {
      ok: false,
      code: "rate_limited",
      message: "Saatlik istek sınırı aşıldı.",
    };
  }

  const challengePassed = await verifyTurnstile(
    data.turnstileToken,
    input.ip ?? undefined
  );
  if (!challengePassed) {
    return {
      ok: false,
      code: "challenge_failed",
      message: "Güvenlik doğrulaması başarısız.",
    };
  }

  const dedupeHash = buildDedupeHash({
    phone: data.phone,
    email: data.email,
    projectId: data.projectId,
  });

  const existing = recentHashes.get(dedupeHash);
  const now = Date.now();
  if (existing && now - existing.at < DEDUPE_TTL) {
    return { ok: true, id: existing.id, deduped: true };
  }

  const id = crypto.randomUUID();
  recentHashes.set(dedupeHash, { id, at: now });
  // Light housekeeping so the map doesn't grow unbounded.
  if (recentHashes.size > 5000) {
    for (const [k, v] of recentHashes) {
      if (now - v.at > DEDUPE_TTL) recentHashes.delete(k);
    }
  }

  const ipHash = input.ip ? sha256(`ip:${input.ip}`) : null;
  const uaHash = input.userAgent ? sha256(`ua:${input.userAgent}`) : null;

  const record: LeadRecord = {
    id,
    receivedAt: new Date().toISOString(),
    name: data.name,
    phone: data.phone || null,
    email: data.email || null,
    message: data.message || null,
    subject: data.subject || null,
    projectInterest: data.projectInterest || null,
    source: data.source || null,
    projectId: data.projectId || null,
    planId: data.planId || null,
    ctaContext: data.ctaContext || null,
    utm: data.utm ? Object.fromEntries(
      Object.entries(data.utm).filter(([, v]) => Boolean(v))
    ) as Record<string, string> : null,
    dedupeHash,
    idempotencyKey: input.idempotencyKey,
    consentPolicyVersion: CURRENT_CONSENT_POLICY_VERSION,
    ipHash,
    userAgentHash: uaHash,
  };

  if (env.HAS_DB) {
    try {
      await leadRepo.create({
        id,
        name: record.name,
        email: record.email,
        phone: record.phone,
        message: record.message,
        subject: record.subject,
        projectInterest: record.projectInterest,
        source: normalizeSource(record.source),
        projectId: record.projectId,
        ctaContext: record.ctaContext,
        utm: record.utm,
        dedupeHash: record.dedupeHash,
        consentPolicyVersion: record.consentPolicyVersion,
        ipHash: record.ipHash,
        userAgentHash: record.userAgentHash,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "unknown";
      console.warn("[lead-ingest] db persist failed:", message);
    }
  }

  try {
    await emitLeadReceived(record);
  } catch (e) {
    console.error("[lead-ingest] outbox failure", e);
    return {
      ok: false,
      code: "server_error",
      message: "İstek alındı fakat bildirim iletilemedi.",
    };
  }

  return { ok: true, id, deduped: false };
}
