import { test, expect } from "@playwright/test";

test.describe("public surface — smoke", () => {
  test("landing page renders hero and primary nav", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page).toHaveTitle(/Sitre/i);

    const nav = page.getByRole("navigation").first();
    await expect(nav).toBeVisible();
  });

  test("projects index responds 200", async ({ page }) => {
    const response = await page.goto("/projeler");
    expect(response?.status()).toBeLessThan(400);
  });

  test("KVKK page renders policy heading", async ({ page }) => {
    await page.goto("/gizlilik");
    await expect(page.locator("h1").first()).toBeVisible();
  });
});
