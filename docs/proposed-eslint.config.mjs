// Proposed eslint.config.mjs — copy to project root after review.
// Hook config-protection blocks direct creation of eslint.config.mjs.
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
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
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: [
      "src/lib/env.ts",
      "src/middleware.ts",
      "next.config.ts",
      "scripts/**/*.{js,mjs,ts}",
      "src/lib/security/**/*.ts",
    ],
    rules: { "no-restricted-properties": "off" },
  },
];

export default eslintConfig;
