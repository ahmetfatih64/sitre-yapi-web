import { test, expect } from "@playwright/test";

test.describe("admin surface — dev session", () => {
  test.beforeEach(async ({ context, baseURL }) => {
    const url = new URL(baseURL ?? "http://localhost:4000");
    await context.addCookies([
      {
        name: "x-dev-actor",
        value: "owner",
        domain: url.hostname,
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
  });

  test("admin dashboard renders for OWNER", async ({ page }) => {
    const res = await page.goto("/admin");
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText(/Hoş geldin/i)).toBeVisible();
  });

  test("projects index is reachable", async ({ page }) => {
    const res = await page.goto("/admin/projects");
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("leads index is reachable", async ({ page }) => {
    const res = await page.goto("/admin/leads");
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("media index is reachable", async ({ page }) => {
    const res = await page.goto("/admin/media");
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("users index is reachable for OWNER", async ({ page }) => {
    const res = await page.goto("/admin/users");
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
  });
});

test.describe("admin surface — RBAC boundary", () => {
  test("SALES cannot open users page", async ({ context, page, baseURL }) => {
    const url = new URL(baseURL ?? "http://localhost:4000");
    await context.addCookies([
      {
        name: "x-dev-actor",
        value: "sales",
        domain: url.hostname,
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
    const res = await page.goto("/admin/users");
    expect(res?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(/\/admin(?!\/users)/);
  });
});
