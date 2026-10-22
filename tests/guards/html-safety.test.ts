import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * Ham HTML basimini denetleyen nobetci.
 *
 * Neden: herkese acik sayfalar statik uretildigi icin nonce tasiyamaz ve
 * `script-src` zorunlu olarak `'unsafe-inline'` icerir (bkz.
 * docs/DEPLOYMENT.md §10). Yani bu sayfalarda CSP, satir ici script
 * enjeksiyonunu DURDURMAZ. Guvenlik tamamen "ham HTML basilan her yerin
 * guvenli olmasi" varsayimina dayanir.
 *
 * Bu varsayim bir kez coktu: JSON-LD, yonetim panelinden duzenlenen proje
 * adini `JSON.stringify` ile script blogunun icine basiyordu ve
 * `</script>` kacirilmadigi icin calistirilabilir kod enjekte edilebiliyordu.
 *
 * Bu test, varsayimi belgelenmis bir niyet olmaktan cikarip zorlanan bir
 * kurala cevirir: asagidaki listede olmayan her ham HTML basimi testi
 * dusurur. Yeni bir kullanim eklemek, onu buraya gerekcesiyle yazmayi
 * gerektirir.
 */

/** Yapisi geregi guvenli oldugu icin her yerde serbest olan ifadeler. */
const SAFE_CALLS = [
  {
    pattern: /^serializeJsonLd\(/,
    reason: "serializeJsonLd '<' karakterini \\u003c olarak kacirir",
  },
];

/** Dosya + ifade bazinda, gerekcesiyle onaylanmis istisnalar. */
const ALLOWED: { file: string; expression: string; reason: string }[] = [
  {
    file: "src/app/gizlilik/page.tsx",
    expression: "gizlilikDoc.bodyHtml",
    reason: "depo icinde sabit yazili hukuki metin; kullanici girdisi degil",
  },
  {
    file: "src/app/kvkk/page.tsx",
    expression: "kvkkDoc.bodyHtml",
    reason: "depo icinde sabit yazili hukuki metin; kullanici girdisi degil",
  },
  {
    file: "src/app/cerez-politikasi/page.tsx",
    expression: "cerezDoc.bodyHtml",
    reason: "depo icinde sabit yazili hukuki metin; kullanici girdisi degil",
  },
];

const SOURCE_ROOT = "src";
const EXTENSIONS = [".ts", ".tsx"];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...sourceFiles(full));
      continue;
    }
    if (!EXTENSIONS.some((e) => entry.endsWith(e))) continue;
    if (entry.endsWith(".test.ts") || entry.endsWith(".test.tsx")) continue;
    out.push(full);
  }
  return out;
}

/** Yol ayiricisini isletim sisteminden bagimsiz hale getirir. */
function normalize(path: string): string {
  return relative(process.cwd(), path).split(sep).join("/");
}

type Usage = { file: string; expression: string; line: number };

function findRawHtmlUsages(): Usage[] {
  const usages: Usage[] = [];
  for (const path of sourceFiles(SOURCE_ROOT)) {
    const source = readFileSync(path, "utf8");
    const file = normalize(path);

    for (const match of source.matchAll(/__html:\s*([\s\S]+?)\s*\}\}/g)) {
      usages.push({
        file,
        expression: (match[1] ?? "").trim(),
        line: source.slice(0, match.index).split(/\n/).length,
      });
    }
    // Istemci kodunda dogrudan atama da ayni riski tasir.
    for (const match of source.matchAll(/\.innerHTML\s*=\s*([^;\n]+)/g)) {
      usages.push({
        file,
        expression: (match[1] ?? "").trim(),
        line: source.slice(0, match.index).split(/\n/).length,
      });
    }
  }
  return usages;
}

function isApproved(usage: Usage): boolean {
  if (SAFE_CALLS.some((s) => s.pattern.test(usage.expression))) return true;
  return ALLOWED.some(
    (a) => a.file === usage.file && a.expression === usage.expression
  );
}

test("ham HTML yalnizca onaylanmis yollardan basilir", () => {
  const unapproved = findRawHtmlUsages().filter((u) => !isApproved(u));

  assert.deepEqual(
    unapproved,
    [],
    unapproved.length === 0
      ? ""
      : "Onaylanmamis ham HTML basimi bulundu:\n" +
          unapproved
            .map((u) => `  ${u.file}:${u.line} -> ${u.expression}`)
            .join("\n") +
          "\n\nHerkese acik sayfalarda CSP satir ici script'i engellemez " +
          "(docs/DEPLOYMENT.md §10). Degeri guvenli bir yardimciyla kacirin " +
          "(ornegin serializeJsonLd) ya da gerekcesiyle birlikte bu dosyadaki " +
          "ALLOWED listesine ekleyin."
  );
});

test("nobetcinin kendisi calisir durumda — bilinen kullanimlari goruyor", () => {
  // Tarayici bozulursa test sessizce 'sorun yok' demesin.
  const usages = findRawHtmlUsages();
  assert.ok(
    usages.length >= 5,
    `beklenenden az kullanim bulundu (${usages.length}); tarayici bozulmus olabilir`
  );
  assert.ok(
    usages.some((u) => u.expression.startsWith("serializeJsonLd(")),
    "JSON-LD kullanimlari bulunamadi; tarayici bozulmus olabilir"
  );
});

test("onaylanmamis bir ifade onaylanmis sayilmaz", () => {
  assert.equal(
    isApproved({ file: "src/app/x/page.tsx", expression: "post.body", line: 1 }),
    false
  );
  assert.equal(
    isApproved({ file: "src/app/x/page.tsx", expression: "JSON.stringify(ld)", line: 1 }),
    false
  );
  // Istisna yalnizca kendi dosyasinda gecerlidir.
  assert.equal(
    isApproved({ file: "src/app/baska/page.tsx", expression: "kvkkDoc.bodyHtml", line: 1 }),
    false
  );
});
