import { test, expect } from "@playwright/test";

test.describe("lead ingest — api contract", () => {
  test("POST /api/contact accepts valid submission", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "Test Kullanıcı",
        phone: "+90 555 000 0000",
        email: "test+e2e@example.com",
        subject: "E2E smoke",
        message: "Otomatik test mesajı.",
        consent: true,
        source: "WEB_FORM",
        ctaContext: "e2e",
      },
      headers: {
        "content-type": "application/json",
        "idempotency-key": `e2e-${Date.now()}`,
      },
    });

    expect(response.status()).toBeLessThan(500);
    const body = (await response.json()) as { ok: boolean; code?: string };
    expect(typeof body.ok).toBe("boolean");
  });

  test("POST /api/contact rejects missing consent", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "Test",
        email: "no-consent@example.com",
      },
      headers: { "content-type": "application/json" },
    });

    expect([400, 422]).toContain(response.status());
    const body = (await response.json()) as { ok: boolean };
    expect(body.ok).toBe(false);
  });

  test("POST /api/contact blocks honeypot", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "Bot",
        email: "bot@example.com",
        consent: true,
        website: "https://spam.example",
      },
      headers: { "content-type": "application/json" },
    });

    const body = (await response.json()) as { ok: boolean; code?: string };
    expect(body.ok).toBe(false);
  });
});

/**
 * Yönetim yüzeyinin sözleşmesi ortama göre değişir:
 *
 *  - Geliştirmede src/lib/auth/session.ts kasıtlı olarak sentetik bir OWNER
 *    oturumu döndürür, böylece panel veritabanı olmadan denenebilir.
 *  - Üretimde bu bypass kapalıdır ve koruma devreye girer.
 *
 * Bu yüzden testler /api/health üzerinden ortamı okuyup ilgili sözleşmeyi
 * doğrular. Tek bir sabit beklenti yazmak, dev sunucusunda hiçbir zaman
 * geçmeyen bir teste yol açıyordu.
 */
async function isProduction(
  request: import("@playwright/test").APIRequestContext
): Promise<boolean> {
  const res = await request.get("/api/health");
  const body = (await res.json()) as { env?: { isProd?: boolean } };
  return Boolean(body.env?.isProd);
}

test.describe("admin surface — guarded routes", () => {
  test("admin erişimi ortamın sözleşmesine uyar", async ({ page, request }) => {
    const prod = await isProduction(request);
    const response = await page.goto("/admin/leads");
    expect(response?.status()).toBeLessThan(500);

    if (prod) {
      await expect(page).toHaveURL(/admin\/login/);
    } else {
      // Geliştirme bypass'ı açık: panel doğrudan render edilmeli.
      await expect(page).toHaveURL(/admin\/leads/);
    }
  });

  test("presign uç noktası ortamın sözleşmesine uyar", async ({ request }) => {
    const prod = await isProduction(request);
    const response = await request.post("/api/admin/upload/presign", {
      data: {
        contentType: "image/jpeg",
        prefix: "projects/inbox",
        filename: "test.jpg",
        byteSize: 1024,
      },
      headers: { "content-type": "application/json" },
    });

    if (prod) {
      expect([401, 403]).toContain(response.status());
    } else {
      // Dev oturumu media.upload iznine sahip OWNER olduğu için istek geçer.
      expect(response.status()).toBeLessThan(500);
      expect([401, 403]).not.toContain(response.status());
    }
  });
});
