/**
 * Next.js instrumentation hook. Loaded once per runtime (nodejs / edge).
 * Sentry init is env-gated: missing DSN turns into a no-op so dev and
 * unprovisioned previews never error or ship a noisy SDK.
 */
import { env } from "@/lib/env";

export async function register(): Promise<void> {
  if (!env.SENTRY_DSN) return;

  const runtime = process.env.NEXT_RUNTIME;
  try {
    if (runtime === "nodejs") {
      const Sentry = await import("@sentry/nextjs").catch(() => null);
      if (!Sentry) {
        console.warn("[instrumentation] @sentry/nextjs not installed; skipping");
        return;
      }
      Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: env.NEXT_PUBLIC_APP_ENV,
        tracesSampleRate: env.IS_APP_PROD ? 0.1 : 1.0,
        sendDefaultPii: false,
      });
    } else if (runtime === "edge") {
      const Sentry = await import("@sentry/nextjs").catch(() => null);
      if (!Sentry) return;
      Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: env.NEXT_PUBLIC_APP_ENV,
        tracesSampleRate: env.IS_APP_PROD ? 0.1 : 1.0,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    console.warn("[instrumentation] Sentry init failed:", message);
  }
}

export async function onRequestError(
  err: unknown,
  request: { path: string; method: string; headers: Record<string, string> },
  context: { routerKind: "Pages Router" | "App Router"; routePath: string; routeType: string }
): Promise<void> {
  if (!env.SENTRY_DSN) return;
  try {
    const Sentry = await import("@sentry/nextjs").catch(() => null);
    if (!Sentry) return;
    const captureRequestError = (
      Sentry as unknown as {
        captureRequestError?: (
          e: unknown,
          r: typeof request,
          c: typeof context
        ) => void;
      }
    ).captureRequestError;
    captureRequestError?.(err, request, context);
  } catch {
    // swallow — instrumentation must never break the request path
  }
}
