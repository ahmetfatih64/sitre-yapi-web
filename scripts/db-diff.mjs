/**
 * Migration üretir — üretim veritabanına dokunmadan.
 *
 * Neden bu script var: `prisma migrate diff --shadow-database-url <url>`
 * verilen adresi **sıfırlar**. Bir kez üretim adresi verilip Neon'daki tüm
 * veri silindi. Bu script o hatayı imkânsız kılar: shadow adresinin yerel
 * olduğunu doğrulamadan Prisma'yı hiç çağırmaz.
 *
 * Kullanım:
 *   npm run db:diff -- <migration_adi>
 *   docker compose -f docker-compose.dev.yml up -d   (shadow için gerekli)
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);
const MIGRATIONS_DIR = "packages/db/prisma/migrations";
const SCHEMA = "packages/db/prisma/schema.prisma";

/** .env dosyasından tek bir anahtarı okur. */
function readEnv(key) {
  for (const file of [".env.local", ".env"]) {
    if (!fs.existsSync(file)) continue;
    const match = fs
      .readFileSync(file, "utf8")
      .match(new RegExp(`^${key}=(.*)$`, "m"));
    if (match?.[1]) return match[1].trim();
  }
  return process.env[key]?.trim() ?? "";
}

function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function fail(lines) {
  console.error("\n" + lines.join("\n") + "\n");
  process.exit(1);
}

const name = process.argv[2];
if (!name || !/^[a-z0-9_]+$/.test(name)) {
  fail([
    "Kullanım: npm run db:diff -- <migration_adi>",
    "Ad yalnızca küçük harf, rakam ve alt çizgi içerebilir.",
  ]);
}

const shadowUrl = readEnv("SHADOW_DATABASE_URL");
if (!shadowUrl) {
  fail([
    "SHADOW_DATABASE_URL tanımlı değil.",
    "",
    "Shadow veritabanı Prisma tarafından SIFIRLANIR; bu yüzden yerel ve",
    "tek kullanımlık olmalıdır. Yerel yığını başlatın:",
    "",
    "  docker compose -f docker-compose.dev.yml up -d",
    "",
    "ve .env dosyasına ekleyin:",
    "",
    "  SHADOW_DATABASE_URL=postgresql://sitre:sitre_dev_local@localhost:5433/sitre_shadow",
  ]);
}

const shadowHost = hostOf(shadowUrl);
if (!LOCAL_HOSTS.has(shadowHost)) {
  fail([
    `REDDEDİLDİ: shadow veritabanı yerel değil (${shadowHost}).`,
    "",
    "Prisma bu adresteki TÜM VERİYİ SİLER. Yalnızca localhost adresleri",
    "kabul edilir. Üretim veya Neon adresi asla shadow olarak verilmemeli.",
  ]);
}

// Güvenlik ağı: shadow ile çalışılan veritabanı aynı olmamalı.
for (const key of ["DATABASE_URL", "DIRECT_URL"]) {
  const value = readEnv(key);
  if (value && value === shadowUrl) {
    fail([
      `REDDEDİLDİ: SHADOW_DATABASE_URL ile ${key} aynı.`,
      "Shadow sıfırlanacağı için bu, çalışılan veritabanını siler.",
    ]);
  }
}

const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const dir = path.join(MIGRATIONS_DIR, `${stamp}_${name}`);
fs.mkdirSync(dir, { recursive: true });
const target = path.join(dir, "migration.sql");

console.log(`\nShadow: ${shadowHost} (yerel, doğrulandı)`);
console.log(`Hedef:  ${target}\n`);

const sql = execFileSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "prisma",
    "migrate",
    "diff",
    "--from-migrations",
    MIGRATIONS_DIR,
    "--to-schema-datamodel",
    SCHEMA,
    "--shadow-database-url",
    shadowUrl,
    "--script",
  ],
  { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
);

if (!sql.trim() || /^\s*--\s*This is an empty migration/i.test(sql)) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("Şema ile migration geçmişi arasında fark yok. Dosya üretilmedi.\n");
  process.exit(0);
}

fs.writeFileSync(target, sql);
console.log(sql);
console.log(`Yazıldı: ${target}`);
console.log("Uygulamak için: npm run db:migrate\n");
