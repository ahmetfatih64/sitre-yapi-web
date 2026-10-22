/**
 * Outbox dispatchers. Each topic handler is env-gated — missing credentials
 * degrade to a log line so dev + unprovisioned previews stay deterministic.
 */
import { env } from "@/lib/env";

export type DispatchResult = { ok: true } | { ok: false; error: string };

interface LeadPayload {
  id?: string;
  name?: string;
  contact?: { phone?: string | null; email?: string | null };
  context?: {
    source?: string | null;
    projectId?: string | null;
    ctaContext?: string | null;
    utm?: Record<string, string> | null;
  };
  receivedAt?: string;
}

function asLeadPayload(raw: unknown): LeadPayload {
  return (typeof raw === "object" && raw !== null ? raw : {}) as LeadPayload;
}

async function postmarkEmail(to: string[], subject: string, body: string): Promise<DispatchResult> {
  if (!env.HAS_POSTMARK || !env.POSTMARK_SERVER_TOKEN || !env.POSTMARK_FROM) {
    console.info("[dispatch] postmark disabled — would send:", subject, "→", to);
    return { ok: true };
  }
  try {
    const res = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": env.POSTMARK_SERVER_TOKEN,
      },
      body: JSON.stringify({
        From: env.POSTMARK_FROM,
        To: to.join(", "),
        Subject: subject,
        TextBody: body,
        MessageStream: "outbound",
      }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return { ok: false, error: `postmark_${res.status}: ${msg.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return { ok: false, error: `postmark_fetch: ${message}` };
  }
}

async function slackWebhook(text: string): Promise<DispatchResult> {
  const url = env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.info("[dispatch] slack disabled — would send:", text.slice(0, 120));
    return { ok: true };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return { ok: false, error: `slack_${res.status}` };
    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return { ok: false, error: `slack_fetch: ${message}` };
  }
}

function leadRecipients(): string[] {
  if (!env.LEAD_NOTIFY_TO) return [];
  return env.LEAD_NOTIFY_TO.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function renderLeadText(payload: LeadPayload): string {
  const lines = [
    `Yeni talep: ${payload.name ?? "—"}`,
    `İletişim: ${payload.contact?.email ?? "—"} / ${payload.contact?.phone ?? "—"}`,
    `Kaynak: ${payload.context?.source ?? "—"}`,
    `Proje: ${payload.context?.projectId ?? "—"}`,
    `CTA: ${payload.context?.ctaContext ?? "—"}`,
    `Zaman: ${payload.receivedAt ?? new Date().toISOString()}`,
    `ID: ${payload.id ?? "—"}`,
  ];
  return lines.join("\n");
}

export async function dispatch(topic: string, payload: unknown): Promise<DispatchResult> {
  switch (topic) {
    case "lead.received": {
      const text = renderLeadText(asLeadPayload(payload));
      const slack = await slackWebhook(`:bell: ${text}`);
      if (!slack.ok) return slack;
      return { ok: true };
    }
    case "lead.notify.email": {
      const to = leadRecipients();
      if (to.length === 0) {
        console.info("[dispatch] lead.notify.email: LEAD_NOTIFY_TO empty — skipped");
        return { ok: true };
      }
      const body = renderLeadText(asLeadPayload(payload));
      return postmarkEmail(to, "Sitre Yapı — yeni talep", body);
    }
    case "lead.crm.push":
    case "lead.notify.slack":
    case "project.published":
    default:
      console.info(`[dispatch] ${topic}: no handler wired — noop`);
      return { ok: true };
  }
}
