import { chromium, devices } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["iPhone 13"] });
const page = await context.newPage();
page.on("console", (m) => console.log("[console]", m.type(), m.text()));
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: "screenshots/mobile-before.png" });

const btn = await page.locator('button[aria-label*="Menü"]').first();
console.log("hamburger count:", await page.locator('button[aria-label*="Menü"]').count());
console.log("aria-expanded before:", await btn.getAttribute("aria-expanded"));

await btn.click();
await page.waitForTimeout(400);
console.log("aria-expanded after:", await btn.getAttribute("aria-expanded"));
console.log("mobile-nav visible:", await page.locator("#mobile-nav").count());
await page.screenshot({ path: "screenshots/mobile-after.png" });

await browser.close();
