import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    /**
     * `next lint` bu yolları kendiliğinden hariç tutuyordu. ESLint CLI'ya
     * geçerken açıkça yazılmaları gerekir; yoksa derleme çıktısı ve
     * vendor dosyaları da denetlenir ve lint kullanılamaz hale gelir.
     */
    ignores: [
      ".next/**",
      ".next-prod/**",
      "out/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
      // Üçüncü taraf, olduğu gibi tutulan kopya (bkz. public/vendor/*/README.md)
      "public/vendor/**",
      // Ayrı repo olarak tutulan proje
      "scripts/aka_software/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "react/no-danger": "warn",
      "react/jsx-no-target-blank": ["error", { allowReferrer: false }],
      "no-restricted-globals": [
        "error",
        { name: "eval", message: "eval() is forbidden." },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.object.name='document'][callee.property.name='write']",
          message: "document.write is forbidden.",
        },
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message:
            "Use typed `env` from @/lib/env instead of process.env in app code.",
        },
      ],
      // info: kasıtlı operasyonel iz kaydı (outbox, lead akışı)
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],
      // `_` öneki "bilerek kullanılmıyor" demektir; arayüz gereği duran
      // parametreleri silmek imzayı bozar.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: [
      "src/lib/env.ts",
      "src/middleware.ts",
      "next.config.ts",
      "scripts/**/*.{js,mjs,ts}",
      "src/lib/security/**/*.ts",
      // NEXT_RUNTIME Next.js tarafından enjekte edilen çalışma zamanı işareti,
      // uygulama yapılandırması değil.
      "src/instrumentation.ts",
      // Test koşucusu yapılandırması; uygulama kodu değil.
      "playwright.config.ts",
      // Workspace paketleri Next uygulamasının dışındadır, `@/lib/env`
      // onlara erişilemez.
      "packages/**/*.ts",
      // site.config istemci bileşenlerinde de kullanılır. `@/lib/env`
      // `process.env` nesnesinin tamamını okur ve yalnızca sunucuda çalışır;
      // istemcide `undefined` dönüp hydration uyuşmazlığı yaratırdı. Burada
      // doğrudan `process.env.NEXT_PUBLIC_SITE_URL` okunur — Next.js bu
      // ifadeyi her iki pakette de derleme anında değeriyle değiştirir.
      "src/content/site.config.ts",
    ],
    rules: { "no-restricted-properties": "off" },
  },
  {
    // Komut satırı araçları ekrana yazmak için vardır; çıktıları ürünün
    // kendisidir, artık hata ayıklama izi değil.
    files: ["scripts/**/*.{js,mjs,ts}"],
    rules: { "no-console": "off" },
  },
  {
    /**
     * `@prisma/client` kurulu değilse stub'a düşen try/catch. `import`
     * eşzamanlı olarak try/catch içine alınamadığı için `require` şart.
     */
    files: ["packages/db/src/index.ts"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
];

export default eslintConfig;
