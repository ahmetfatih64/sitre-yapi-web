import type { ContactFormParsed } from "@/lib/forms/schema";

export interface LeadRecord {
  id: string;
  receivedAt: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  subject: string | null;
  projectInterest: string | null;

  source: string | null;
  projectId: string | null;
  planId: string | null;
  ctaContext: string | null;
  utm: Record<string, string> | null;

  dedupeHash: string;
  idempotencyKey: string | null;

  /** Audit surface for consent; actual retention lives in consent_snapshots. */
  consentPolicyVersion: string;
  ipHash: string | null;
  userAgentHash: string | null;
}

export type LeadIngestResult =
  | { ok: true; id: string; deduped: boolean }
  | { ok: false; code: LeadIngestErrorCode; message: string };

export type LeadIngestErrorCode =
  | "invalid"
  | "rate_limited"
  | "challenge_failed"
  | "honeypot"
  | "server_error";

export interface LeadIngestContext {
  ip: string | null;
  userAgent: string | null;
  idempotencyKey: string | null;
  parsed: ContactFormParsed;
}
