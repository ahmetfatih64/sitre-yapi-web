import "server-only";

import { env } from "@/lib/env";
import type { LeadRecord } from "./types";

/**
 * Talep hiçbir kalıcı yere yazılamadığında son çare bildirimi.
 *
 * Normal akışta talep önce veritabanına, sonra outbox'a yazılır ve e-postayı
 * zamanlanmış görev gönderir. Veritabanı erişilemezse bu zincirin tamamı
 * kopar — talep kaybolur ama kullanıcı "iletildi" görür. Bu modül o boşluğu
 * kapatır: doğrudan, kuyruk kullanmadan gönderir.
 *
 * `postmarkEmail`'den farkı: yapılandırma eksikse **başarılı taklidi yapmaz**,
 * dürüstçe false döner. Çağıran buna göre kullanıcıya doğru mesajı gösterir.
 */

function renderLead(record: LeadRecord): string {
  return [
    "ACİL: Bu talep veritabanına yazılamadı, doğrudan gönderiliyor.",
    "",
    `Ad: ${record.name ?? "—"}`,
    `E-posta: ${record.email ?? "—"}`,
    `Telefon: ${record.phone ?? "—"}`,
    `Konu: ${record.subject ?? "—"}`,
    `İlgilendiği proje: ${record.projectInterest ?? "—"}`,
    "",
    "Mesaj:",
    record.message ?? "—",
    "",
    `Zaman: ${new Date().toISOString()}`,
  ].join("\n");
}

function recipients(): string[] {
  if (!env.LEAD_NOTIFY_TO) return [];
  return env.LEAD_NOTIFY_TO.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function sendViaSmtp(to: string[], body: string): Promise<boolean> {
  const from = env.EMAIL_FROM ?? env.POSTMARK_FROM;
  if (!env.EMAIL_SERVER_HOST || !from) return false;
  try {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: env.EMAIL_SERVER_HOST,
      port: env.EMAIL_SERVER_PORT ?? 587,
      secure: false,
      ignoreTLS: !env.EMAIL_SERVER_USER,
      ...(env.EMAIL_SERVER_USER
        ? {
            auth: {
              user: env.EMAIL_SERVER_USER,
              pass: env.EMAIL_SERVER_PASSWORD ?? "",
            },
          }
        : {}),
    });
    await transport.sendMail({
      from,
      to: to.join(", "),
      subject: "Sitre Yapı — ACİL: kaydedilemeyen talep",
      text: body,
    });
    return true;
  } catch (error) {
    console.error(
      "[direct-notify] smtp gönderimi başarısız:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

async function sendViaPostmark(to: string[], body: string): Promise<boolean> {
  if (!env.POSTMARK_SERVER_TOKEN || !env.POSTMARK_FROM) return false;
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
        Subject: "Sitre Yapı — ACİL: kaydedilemeyen talep",
        TextBody: body,
        MessageStream: "outbound",
      }),
    });
    if (!res.ok) {
      console.error("[direct-notify] postmark reddetti:", res.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      "[direct-notify] postmark gönderimi başarısız:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

/** Gönderilebildiyse true. Yapılandırma eksikse false — sessizce başarı yok. */
export async function notifyLeadDirectly(record: LeadRecord): Promise<boolean> {
  const to = recipients();
  if (to.length === 0) {
    console.error(
      "[direct-notify] LEAD_NOTIFY_TO tanımlı değil — talep bildirilemiyor."
    );
    return false;
  }
  const body = renderLead(record);
  // SMTP öncelikli; yoksa Postmark API.
  return (await sendViaSmtp(to, body)) || (await sendViaPostmark(to, body));
}
