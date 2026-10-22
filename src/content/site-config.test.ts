import test from "node:test";
import assert from "node:assert/strict";
import { FALLBACK_SITE_URL, resolveSiteUrl, siteConfig } from "./site.config";

/**
 * Yayın adresi SEO'nun tek kaynağıdır: kanonik adres, OG etiketleri,
 * sitemap, robots.txt ve JSON-LD hep buradan türer. Bozulursa canlı site
 * var olmayan bir alan adını gösterir ve bu sessizce olur.
 */

test("yayın adresi geçerli bir mutlak adrestir", () => {
  const url = new URL(siteConfig.url);
  assert.ok(["http:", "https:"].includes(url.protocol));
  assert.ok(url.hostname.length > 0);
});

test("yayın adresi eğik çizgiyle bitmez", () => {
  // `${siteConfig.url}/projeler` çift eğik çizgi üretmemeli.
  assert.ok(
    !siteConfig.url.endsWith("/"),
    `adres eğik çizgiyle bitiyor: ${siteConfig.url}`
  );
  assert.ok(!`${siteConfig.url}/projeler`.includes("//projeler"));
});

test("ortam değişkeni okunur ve sondaki eğik çizgi kırpılır", () => {
  assert.equal(resolveSiteUrl("https://ornek.com.tr/"), "https://ornek.com.tr");
  assert.equal(resolveSiteUrl("https://ornek.com.tr///"), "https://ornek.com.tr");
  assert.equal(resolveSiteUrl("  https://bosluklu.com  "), "https://bosluklu.com");
});

test("değişken verilmezse yedek adres kullanılır", () => {
  assert.equal(resolveSiteUrl(undefined), FALLBACK_SITE_URL);
  assert.equal(resolveSiteUrl(""), FALLBACK_SITE_URL);
  assert.equal(resolveSiteUrl("   "), FALLBACK_SITE_URL);
});

test("iletişim bilgileri boş bırakılmamıştır", () => {
  assert.ok(siteConfig.contact.phone.trim());
  assert.ok(siteConfig.contact.email.includes("@"));
  assert.ok(siteConfig.contact.address.city.trim());
});
