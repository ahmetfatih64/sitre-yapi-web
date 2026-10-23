#!/usr/bin/env node
/**
 * Kabul ölçütleri denetimi (QA Faz 3).
 *
 * SUCCESS_CRITERIA.md içindeki ölçülebilir hedefleri üretim sunucusuna
 * karşı koşar: responsive taşma, dokunma hedefleri, erişilebilirlik (axe)
 * ve Core Web Vitals.
 *
 * İçerik değiştiğinde TEKRAR KOŞULMALIDIR — görsel ağırlıkları ve metin
 * uzunlukları değişince LCP, CLS ve taşma davranışı da değişir.
 *
 * Kullanım:
 *   npm run build:prod                     # önce üretim derlemesi
 *   npm run start:prod                     # ayrı terminalde
 *   npm run qa:acceptance
 *   npm run qa:acceptance -- --base https://alan-adiniz
 *
 * Çıkış kodu: bulgu varsa 1, temizse 0.
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const req = createRequire(import.meta.url);
const AXE = readFileSync(req.resolve("axe-core/axe.min.js"), "utf8");

const argIndex = process.argv.indexOf("--base");
const BASE =
  (argIndex > -1 ? process.argv[argIndex + 1] : null) ??
  process.env.QA_BASE_URL ??
  "http://localhost:4100";

const PAGES = [
  "/",
  "/projeler",
  "/projeler/sitre-urla-konaklari",
  "/iletisim",
  "/hakkimizda",
];
const WIDTHS = [360, 375, 768, 1024, 1440, 1920];
const TOUCH_MIN = 44;
const LCP_LIMIT = 2500;
const CLS_LIMIT = 0.05;

/**
 * Bilinçli kabul edilen sapmalar. Her biri gerekçesiyle burada durur;
 * bu listeye ekleme yapmak bilinçli bir karar olmalıdır.
 */
const KABUL_EDILEN = [
  {
    esles: (x) => x.tur === "dokunma" && x.etiket === "KVKK" && x.h >= TOUCH_MIN,
    gerekce:
      "Genişlik metin uzunluğundan gelir; min-width dayatmak kısa " +
      "bağlantıların etrafında görsel boşluk yaratır. Yükseklik 44px ve " +
      "WCAG 2.5.8 (24x24) geçiliyor.",
  },
];

const bulgular = [];
const ekle = (x) => {
  if (KABUL_EDILEN.some((k) => k.esles(x))) return;
  bulgular.push(x);
};

async function onayKapat(page) {
  const b = page.getByRole("button", { name: /tümünü kabul et/i });
  if (await b.isVisible().catch(() => false)) await b.click();
}

async function responsive(browser) {
  console.log("\n— Yatay taşma —");
  for (const w of WIDTHS) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } });
    const tasan = [];
    for (const yol of PAGES) {
      await p.goto(BASE + yol, { waitUntil: "networkidle" });
      await onayKapat(p);
      await p.waitForTimeout(200);
      const fazla = await p.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      if (fazla > 1) {
        tasan.push(`${yol} (+${fazla}px)`);
        ekle({ tur: "tasma", genislik: w, yol, fazla });
      }
    }
    console.log(
      `  ${String(w).padStart(4)}px  ${tasan.length ? "TAŞMA: " + tasan.join(", ") : "temiz"}`
    );
    await p.close();
  }
}

async function dokunma(browser) {
  console.log("\n— Dokunma hedefleri (pointer: coarse, min 44px) —");
  // isMobile kapalı: cihaz pikseli yerine CSS pikseli ölçülür.
  const p = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  for (const yol of PAGES) {
    await p.goto(BASE + yol, { waitUntil: "networkidle" });
    await onayKapat(p);
    await p.waitForTimeout(300);
    const kucuk = await p.evaluate((min) => {
      const secici =
        "button, input, select, textarea, nav a[href], [role=button]";
      return [...document.querySelectorAll(secici)]
        .filter((el) => {
          if (el.offsetParent === null) return false;
          const cs = getComputedStyle(el);
          // Görsel olarak gizlenmiş atlama bağlantıları dokunma hedefi değildir.
          if (cs.clipPath !== "none" && cs.position === "absolute") return false;
          // Vendor panorama görüntüleyicisi kendi ölçülerini yönetir.
          if (String(el.className).includes("pnlm-")) return false;
          // Etkin hedef: saran <label> varsa odur (ör. onay kutusu satırı).
          const hedef = el.closest("label") ?? el;
          const r = hedef.getBoundingClientRect();
          // Ekran dışına taşınmış kapalı paneller (mobil menü) sayılmaz.
          if (r.x >= window.innerWidth || r.right <= 0) return false;
          return r.width > 0 && (r.width < min - 0.5 || r.height < min - 0.5);
        })
        .map((el) => {
          const hedef = el.closest("label") ?? el;
          const r = hedef.getBoundingClientRect();
          const ad =
            el.getAttribute("aria-label") || el.textContent || el.tagName;
          return {
            etiket: ad.trim().slice(0, 26),
            w: Math.round(r.width),
            h: Math.round(r.height),
          };
        });
    }, TOUCH_MIN);
    for (const k of kucuk) ekle({ tur: "dokunma", yol, ...k });
    console.log(
      `  ${yol.padEnd(34)} ${kucuk.length ? kucuk.length + " aday" : "temiz"}`
    );
    for (const k of kucuk) {
      console.log(`       ${k.w}x${k.h}  "${k.etiket}"`);
    }
  }
  await p.close();
}

async function erisilebilirlik(browser) {
  console.log("\n— Erişilebilirlik (axe, WCAG 2.0/2.1 A+AA) —");
  for (const yol of PAGES) {
    for (const w of [390, 1280]) {
      const p = await browser.newPage({ viewport: { width: w, height: 900 } });
      await p.goto(BASE + yol, { waitUntil: "networkidle" });
      await onayKapat(p);
      await p.waitForTimeout(300);
      await p.addScriptTag({ content: AXE });
      const ihlaller = await p.evaluate(async () => {
        const r = await window.axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
          },
        });
        return r.violations
          .filter((v) => ["serious", "critical"].includes(v.impact))
          .map((v) => ({
            id: v.id,
            adet: v.nodes.length,
            ornek: v.nodes[0]?.html.slice(0, 70),
          }));
      });
      for (const x of ihlaller) ekle({ tur: "a11y", yol, genislik: w, ...x });
      const ozet = ihlaller.length
        ? ihlaller.map((x) => `${x.id}(${x.adet})`).join(", ")
        : "ihlal yok";
      console.log(`  ${yol.padEnd(34)} ${w}px  ${ozet}`);
      await p.close();
    }
  }
}

async function cwv(browser) {
  console.log("\n— Core Web Vitals (laboratuvar: 4x CPU, ~10Mbps/70ms) —");
  console.log(`  hedef: LCP <= ${LCP_LIMIT / 1000}s, CLS <= ${CLS_LIMIT}`);
  for (const yol of PAGES.slice(0, 4)) {
    const olcumler = [];
    for (let n = 0; n < 2; n += 1) {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      });
      await ctx.addInitScript(() => {
        window.__cls = 0;
        window.__lcp = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) {
            if (!e.hadRecentInput) window.__cls += e.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) window.__lcp = e.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
      });
      const p = await ctx.newPage();
      const cdp = await ctx.newCDPSession(p);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 70,
        downloadThroughput: (10 * 1024 * 1024) / 8,
        uploadThroughput: (3 * 1024 * 1024) / 8,
      });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await p.goto(BASE + yol, { waitUntil: "load" });
      await p.waitForTimeout(4000);
      olcumler.push(
        await p.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }))
      );
      await ctx.close();
    }
    // LCP'de iyimser, CLS'de kötümser: kararsızlık yanlış "geçti" üretmesin.
    const lcp = Math.min(...olcumler.map((m) => m.lcp));
    const cls = Math.max(...olcumler.map((m) => m.cls));
    if (lcp > LCP_LIMIT) ekle({ tur: "lcp", yol, deger: Math.round(lcp) });
    if (cls > CLS_LIMIT) ekle({ tur: "cls", yol, deger: +cls.toFixed(4) });
    const im = (v, lim) => (v <= lim ? "GEÇTİ" : "AŞILDI");
    console.log(
      `  ${yol.padEnd(34)} LCP ${(lcp / 1000).toFixed(2)}s ${im(lcp, LCP_LIMIT).padEnd(7)} CLS ${cls.toFixed(4)} ${im(cls, CLS_LIMIT)}`
    );
  }
}

/**
 * Hedefin gerçekten sağlıklı servis ettiğini doğrular.
 *
 * Çalışan bir sunucunun derleme dizini silinirse sunucu ayakta kalır ama
 * stil dosyalarını eksik servis eder. O durumda bu denetim onlarca sahte
 * bulgu üretir (her şey stilsiz ölçülür). Ölçmeden önce temel stilin
 * yüklendiği kontrol edilir.
 */
async function hedefSagliklimi(browser) {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    const yanit = await p.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    if (!yanit || !yanit.ok()) {
      return `${BASE} yanıt vermedi (HTTP ${yanit ? yanit.status() : "yok"})`;
    }
    const durum = await p.evaluate(() => ({
      // Tasarım token'ı yoksa ana stil dosyası yüklenmemiştir.
      token: getComputedStyle(document.documentElement)
        .getPropertyValue("--color-brand")
        .trim(),
      sayfaSayisi: document.styleSheets.length,
    }));
    if (!durum.token) {
      return (
        "Ana stil dosyası yüklenmemiş (--color-brand tanımsız). " +
        "Sunucu, silinmiş ya da eksik bir derlemeden servis ediyor olabilir: " +
        "`npm run build:prod` sonrası `npm run start:prod` ile yeniden başlatın."
      );
    }
    return null;
  } finally {
    await p.close();
  }
}

const browser = await chromium.launch();
console.log(`Kabul ölçütleri denetimi — hedef: ${BASE}`);

const sorun = await hedefSagliklimi(browser);
if (sorun) {
  console.error(`\nHEDEF SAĞLIKSIZ: ${sorun}`);
  await browser.close();
  process.exit(2);
}

try {
  await responsive(browser);
  await dokunma(browser);
  await erisilebilirlik(browser);
  await cwv(browser);
} finally {
  await browser.close();
}

console.log("\n" + "=".repeat(60));
if (bulgular.length === 0) {
  console.log("SONUÇ: tüm kabul ölçütleri geçti.");
  process.exit(0);
}
console.log(`SONUÇ: ${bulgular.length} bulgu`);
for (const b of bulgular) console.log("  " + JSON.stringify(b));
process.exit(1);
