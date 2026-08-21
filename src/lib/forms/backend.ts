import type { ContactFormParsed } from "./schema";

export type SendResult = { ok: true } | { ok: false; error: string };

export async function sendContactMessage(
  data: ContactFormParsed
): Promise<SendResult> {
  const backend = process.env.FORM_BACKEND;

  if (!backend) {
    console.info("[contact] FORM_BACKEND not configured — logging only", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      projectInterest: data.projectInterest,
      message: data.message,
    });
    return { ok: true };
  }

  // TODO: swap this block for the real backend adapter (Resend / SMTP / webhook).
  return { ok: true };
}
