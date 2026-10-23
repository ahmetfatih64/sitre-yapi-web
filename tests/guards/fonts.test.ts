import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Fontların depodan servis edilmeye devam ettiğini denetler.
 *
 * `next/font/google` fontları DERLEME ANINDA indirir; derleme o zaman
 * fonts.googleapis.com'un erişilebilir olmasına bağımlı olur ve
 * erişilemediği anda nedenini belli etmeyen bir hatayla düşer. Bu 22 Ekim
 * 2026'da CI'da yaşandı. Geri dönülmemesi için test düşer.
 *
 * Gerekçe ve dosyaların nasıl üretildiği: `src/app/fonts/README.md`.
 */

const FONT_DIR = "src/app/fonts";

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

test("next/font/google hiçbir yerde kullanılmaz", () => {
  const offenders = sourceFiles("src").filter((f) =>
    /from\s+["']next\/font\/google["']/.test(readFileSync(f, "utf8"))
  );
  assert.deepEqual(
    offenders,
    [],
    `next/font/google derlemeyi ağa bağımlı kılar; yerel fonta dönün: ${offenders.join(", ")}`
  );
});

test("yerel font dosyaları yerinde ve makul boyutta", () => {
  for (const file of ["inter-latin.woff2", "fraunces-latin.woff2"]) {
    const path = join(FONT_DIR, file);
    const size = statSync(path).size;
    // Boş/bozuk bir dosya sessizce yedek fonta düşürür.
    assert.ok(size > 20_000, `${file} beklenenden küçük (${size} bayt)`);
    assert.ok(size < 1_500_000, `${file} beklenenden büyük (${size} bayt)`);
  }
});

test("layout yerel fontları kullanır", () => {
  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(layout, /from\s+["']next\/font\/local["']/);
  assert.match(layout, /inter-latin\.woff2/);
  assert.match(layout, /fraunces-latin\.woff2/);
});

test("lisans metinleri dağıtımla birlikte duruyor", () => {
  // OFL yeniden dağıtımda lisans metninin bulundurulmasını şart koşar.
  for (const file of ["Inter-OFL.txt", "Fraunces-OFL.txt"]) {
    const body = readFileSync(join(FONT_DIR, file), "utf8");
    assert.match(body, /SIL OPEN FONT LICENSE/i, `${file} lisans metni değil`);
  }
});

test("CSS fontları next/font değişkenleri üzerinden çağırır", () => {
  // next/font yerel dosyadan karma aile adı üretir; düz "Inter"/"Fraunces"
  // adlarıyla çağrı sessizce yedek fonta düşer.
  const css = readFileSync("src/app/globals.css", "utf8");
  assert.match(css, /--font-display:\s*var\(--font-display-loaded\)/);
  assert.match(css, /--font-body:\s*var\(--font-body-loaded\)/);
});
