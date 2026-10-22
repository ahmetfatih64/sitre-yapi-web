import { z } from "zod";

/**
 * Runtime env schema. Missing values don't crash the build; they flip features
 * into mock/log mode. Use `env.*` instead of `process.env.*` in app code.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "preview", "staging", "production"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  // Turnstile (client + server). Optional — disabled when absent.
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),

  // Upstash Redis (rate limit / idempotency). Optional — in-memory fallback.
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Outbound email (Postmark). Optional — log adapter when absent.
  POSTMARK_SERVER_TOKEN: z.string().optional(),
  POSTMARK_FROM: z.string().email().optional(),

  // Genel SMTP. Verilirse Postmark yerine bu kullanılır; yerel bir posta
  // yakalayıcısına (Mailpit vb.) yönlendirmeyi ve satıcı değiştirmeyi sağlar.
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.coerce.number().int().positive().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  LEAD_NOTIFY_TO: z.string().optional(), // comma-separated

  // CRM (HubSpot) placeholder.
  HUBSPOT_PRIVATE_TOKEN: z.string().optional(),

  // Outbox kuyruğunu işleyen zamanlanmış görevin paylaşılan sırrı.
  CRON_SECRET: z.string().optional(),

  // Yeni talep bildirimi için Slack webhook'u.
  SLACK_WEBHOOK_URL: z.string().url().optional(),

  // Sentry.
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Analytics.
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),

  // Database (Prisma).
  DATABASE_URL: z.string().optional(),

  // Auth.js
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // R2 storage.
  R2_ACCOUNT_ID: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_PUBLIC_BASE: z.string().url().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Do not throw in production builds; log the issues and continue with defaults.
  console.warn(
    "[env] partial parse",
    parsed.error.flatten().fieldErrors
  );
}

const raw = parsed.success ? parsed.data : schema.parse({});

export const env = {
  ...raw,
  IS_PROD: raw.NODE_ENV === "production",
  IS_APP_PROD: raw.NEXT_PUBLIC_APP_ENV === "production",
  HAS_TURNSTILE: Boolean(
    raw.NEXT_PUBLIC_TURNSTILE_SITE_KEY && raw.TURNSTILE_SECRET_KEY
  ),
  HAS_UPSTASH: Boolean(
    raw.UPSTASH_REDIS_REST_URL && raw.UPSTASH_REDIS_REST_TOKEN
  ),
  HAS_POSTMARK: Boolean(raw.POSTMARK_SERVER_TOKEN && raw.POSTMARK_FROM),
  HAS_CRM: Boolean(raw.HUBSPOT_PRIVATE_TOKEN),
  HAS_DB: Boolean(raw.DATABASE_URL),
  HAS_AUTH: Boolean(raw.NEXTAUTH_SECRET && raw.DATABASE_URL),
  HAS_R2: Boolean(
    raw.R2_ACCOUNT_ID &&
      raw.R2_BUCKET &&
      raw.R2_ACCESS_KEY_ID &&
      raw.R2_SECRET_ACCESS_KEY &&
      raw.R2_PUBLIC_BASE
  ),
} as const;

export type Env = typeof env;
