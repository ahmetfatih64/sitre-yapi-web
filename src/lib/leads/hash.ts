import { createHash } from "crypto";

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function normalizePhone(phone: string | null | undefined): string {
  return (phone ?? "").replace(/[^\d]/g, "");
}

export function normalizeEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

/**
 * Lead dedupe hash — collapses repeated submissions from the same contact
 * for the same project into a single bucket over ~10 minutes.
 */
export function buildDedupeHash(input: {
  phone?: string | null;
  email?: string | null;
  projectId?: string | null;
  bucketMinutes?: number;
}): string {
  const bucket = Math.floor(Date.now() / ((input.bucketMinutes ?? 10) * 60_000));
  const parts = [
    normalizePhone(input.phone),
    normalizeEmail(input.email),
    (input.projectId ?? "").trim().toLowerCase(),
    String(bucket),
  ].join("|");
  return sha256(parts);
}
