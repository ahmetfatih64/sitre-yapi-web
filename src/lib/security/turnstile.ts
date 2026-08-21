import { env } from "@/lib/env";

export async function verifyTurnstile(
  token: string | undefined,
  ip: string | undefined
): Promise<boolean> {
  if (!env.HAS_TURNSTILE) return true; // disabled in dev until keys provisioned
  if (!token) return false;
  try {
    const body = new URLSearchParams();
    body.set("secret", env.TURNSTILE_SECRET_KEY!);
    body.set("response", token);
    if (ip) body.set("remoteip", ip);
    const r = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body, cache: "no-store" }
    );
    const data = (await r.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch (e) {
    console.warn("[turnstile] verify failed", e);
    return false;
  }
}
