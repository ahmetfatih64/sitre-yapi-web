import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4000);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /**
   * Tüm testler tek bir Turbopack dev sunucusuna gider. Yerelde varsayılan
   * işçi sayısı (çekirdeğin yarısı) o sunucuyu darboğaza sokuyor ve App
   * Router gezinmeleri (`router.replace`) saniyelerce sürebiliyor —
   * uygulama hatası değil, sunucu yükü. CI'da `retries` bunu telafi ediyor;
   * yerelde retries 0 olduğu için eşzamanlılığı düşürüyoruz ki gerçek
   * hatalar yük gürültüsünün altında kaybolmasın.
   */
  workers: process.env.CI ? undefined : 2,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: process.env.PLAYWRIGHT_NO_SERVER
    ? undefined
    : {
        command: `npm run dev -- --port ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
