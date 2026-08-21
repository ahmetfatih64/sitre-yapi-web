import { chromium, devices } from "playwright";
import fs from "node:fs";
import path from "node:path";

const outDir = "screenshots";
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { name: "home", url: "http://localhost:3000/" },
  { name: "projeler", url: "http://localhost:3000/projeler" },
  { name: "detail", url: "http://localhost:3000/projeler/sitre-urla-konaklari" },
  { name: "iletisim", url: "http://localhost:3000/iletisim" },
];

const viewports = [
  { name: "mobile", opts: { ...devices["iPhone 13"] } },
  { name: "desktop", opts: { viewport: { width: 1440, height: 900 } } },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const context = await browser.newContext(vp.opts);
  const page = await context.newPage();
  for (const p of pages) {
    try {
      await page.goto(p.url, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(800);
      const file = path.join(outDir, `${p.name}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`OK  ${file}`);
    } catch (e) {
      console.log(`ERR ${p.name}-${vp.name}: ${e.message}`);
    }
  }
  await context.close();
}
await browser.close();
