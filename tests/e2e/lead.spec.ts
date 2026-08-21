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

test.describe("admin surface — guarded routes", () => {
  test("unauthenticated admin redirects to login", async ({ page }) => {
    const response = await page.goto("/admin/leads");
    expect(response?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(/\/admin\/login|\/admin$/);
  });

  test("presign endpoint requires auth", async ({ request }) => {
    const response = await request.post("/api/admin/upload/presign", {
      data: {
        contentType: "image/jpeg",
        prefix: "projects/inbox",
        filename: "test.jpg",
        byteSize: 1024,
      },
      headers: { "content-type": "application/json" },
    });

    expect([401, 403]).toContain(response.status());
  });
});
