/**
 * Dağıtım öncesi ortam değişkeni kontrolü.
 *
 * Amaç: "sessizce yanlış çalışan" dağıtımları engellemek. Uygulama eksik
 * değişkende çökmez, ilgili özelliği kapatır — bu geliştirmede doğru davranış
 * ama canlıda fark edilmeden özellik kaybına yol açar.
 *
 * Kullanım:  node scripts/env-check.mjs
 * CI/deploy: npm run check:env
 */
import fs from "node:fs";
import path from "node:path";

/** .env.local varsa process.env'in üstüne bindirmeden oku. */
function loadLocalEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const local = loadLocalEnv();
const get = (k) => (process.env[k] ?? local[k] ?? "").trim();

const appEnv = get("NEXT_PUBLIC_APP_ENV") || "development";
const isProd = appEnv === "production";

/**
 * consequence: değişken eksikse ne olur. Mesajın değeri burada —
 * "eksik" demek yerine kaybedilen davranışı söylüyoruz.
 */
const CHECKS = [
  {
    // Tanımsızsa uygulama "development"a düşer; bu geliştirmede doğru davranış.
    // Bu yüzden eksikliği uyarı, geçersiz değer ise hatadır. Dağıtım hattı
    // bu değeri açıkça vermelidir: NEXT_PUBLIC_APP_ENV=production npm run check:env
    key: "NEXT_PUBLIC_APP_ENV",
    required: false,
    valid: (v) => ["development", "preview", "staging", "production"].includes(v),
    invalidIsError: true,
    consequence:
      '"production" değilse robots.txt "Disallow: /" üretir — site arama motorlarına tamamen kapanır. Canlı dağıtımda açıkça "production" verin.',
  },
  {
    key: "NEXT_PUBLIC_SITE_URL",
    required: isProd,
    valid: (v) => /^https?:\/\/[^\s/]+$/.test(v) && !v.endsWith("/"),
    consequence:
      "Kanonik URL'ler, sitemap ve OG etiketleri yanlış adrese işaret eder. Sonunda eğik çizgi olmamalı.",
  },
  {
    key: "DATABASE_URL",
    required: isProd,
    consequence:
      "İletişim formundan gelen talepler hiçbir yere kaydedilmez. Form kullanıcıya başarılı görünür ama veri kaybolur.",
  },
  {
    key: "NEXTAUTH_SECRET",
    required: isProd,
    valid: (v) => v.length >= 32,
    consequence:
      "Yönetim paneline giriş yapılamaz. En az 32 karakter olmalı (openssl rand -base64 32).",
  },
  {
    key: "POSTMARK_SERVER_TOKEN",
    required: isProd,
    consequence:
      "Yeni talep bildirimleri gönderilmez ve panele e-posta ile giriş yapılamaz.",
  },
  {
    key: "LEAD_NOTIFY_TO",
    required: isProd,
    consequence:
      "Talep geldiğinde kimseye haber verilmez; talepler yalnızca panelde birikir.",
  },
  {
    key: "CRON_SECRET",
    required: isProd,
    consequence:
      "Outbox uç noktası üretimde tüm istekleri reddeder — bekleyen bildirimler hiç işlenmez.",
  },
  {
    key: "TURNSTILE_SECRET_KEY",
    required: false,
    consequence: "Bot koruması devre dışı kalır. Hız sınırı yine çalışır.",
  },
  {
    key: "UPSTASH_REDIS_REST_URL",
    required: false,
    consequence:
      "Hız sınırı bellek içi sayaca düşer; birden fazla sunucu örneğinde sınır örnek başına ayrı sayılır.",
  },
  {
    key: "SENTRY_DSN",
    required: false,
    consequence: "Hatalar yalnızca sunucu loglarına düşer, merkezi izleme olmaz.",
  },
];

const errors = [];
const warnings = [];

for (const check of CHECKS) {
  const value = get(check.key);
  if (!value) {
    (check.required ? errors : warnings).push(
      `${check.key} tanımlı değil\n    → ${check.consequence}`
    );
    continue;
  }
  if (check.valid && !check.valid(value)) {
    (check.required || check.invalidIsError ? errors : warnings).push(
      `${check.key} geçersiz ("${value}")\n    → ${check.consequence}`
    );
  }
}



console.log(`\nOrtam: ${appEnv}\n`);

if (warnings.length) {
  console.log(`UYARI (${warnings.length}) — özellik kapalı kalacak:`);
  warnings.forEach((w) => console.log(`  • ${w}`));
  console.log("");
}

if (errors.length) {
  console.log(`HATA (${errors.length}) — bu dağıtım bozuk çalışır:`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log("");
  process.exit(1);
}

console.log(
  warnings.length
    ? "Zorunlu değişkenler tamam. Yukarıdaki özellikler kapalı olacak.\n"
    : "Tüm değişkenler tamam.\n"
);
