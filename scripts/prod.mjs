#!/usr/bin/env node
/**
 * Üretim build'ini/sunucusunu ayrı bir çıktı dizininde çalıştırır.
 *
 * Neden: `next build` ile `next dev` varsayılan olarak aynı `.next`
 * dizinini kullanır. Dev sunucusu açıkken üretim build'i alınırsa dev
 * sunucusunun chunk'ları silinir ve sunucu 500 vermeye başlar — hata
 * mesajı da (ENOENT ... chunks) nedeni hiç belli etmez.
 *
 * Kullanım:
 *   node scripts/prod.mjs build
 *   node scripts/prod.mjs start
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const DIST_DIR = ".next-prod";
const ALLOWED = new Set(["build", "start"]);

const command = process.argv[2];

if (!ALLOWED.has(command)) {
  console.error(
    `Kullanım: node scripts/prod.mjs <${[...ALLOWED].join("|")}>\n` +
      `Verilen: ${command ?? "(yok)"}`
  );
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [
    // Windows'ta URL.pathname "/C:/..." verir; fileURLToPath şart.
    fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url)),
    command,
  ],
  {
    stdio: "inherit",
    env: { ...process.env, NEXT_DIST_DIR: DIST_DIR },
  }
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
