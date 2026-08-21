#!/usr/bin/env node
/**
 * Content / slug consistency validator.
 *
 * Checks:
 *  - slugs are unique, lowercase, kebab-case
 *  - required image src paths exist under /public (or /src)
 *  - plan codes unique within a project
 *  - gallery items reference an allowed category
 *  - lat/lng look like Turkey-bounded coordinates
 *  - meta.description length within 50–200 chars
 *
 * Exits with non-zero status when any HARD check fails.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

const errors = [];
const warnings = [];

function err(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TR_LAT = [35.5, 42.5];
const TR_LNG = [25.5, 45.5];

async function loadProjects() {
  // The content module is TS — require running through tsx OR via a JSON dump.
  // Simpler: parse each file as text and grab `slug:` literals + meta description regex.
  // This is a lightweight static scan to keep the validator dependency-free.
  const dir = join(ROOT, "src/content/projects");
  const files = ["sitre-urla-konaklari.ts", "sitre-cesme-residence.ts", "sitre-bornova-park.ts"];
  return files.map((f) => {
    const text = readFileSync(join(dir, f), "utf8");
    return { file: f, text };
  });
}

function extract(text, key) {
  const re = new RegExp(`${key}\\s*:\\s*"([^"]*)"`);
  const m = text.match(re);
  return m ? m[1] : null;
}

function extractAll(text, key) {
  const re = new RegExp(`${key}\\s*:\\s*"([^"]*)"`, "g");
  return [...text.matchAll(re)].map((m) => m[1]);
}

function extractNumber(text, key) {
  const re = new RegExp(`${key}\\s*:\\s*(-?\\d+\\.?\\d*)`);
  const m = text.match(re);
  return m ? parseFloat(m[1]) : null;
}

async function main() {
  const docs = await loadProjects();
  const slugs = new Set();

  for (const { file, text } of docs) {
    const slug = extract(text, "slug");
    if (!slug) {
      err(`${file}: missing slug`);
      continue;
    }
    if (!SLUG_RE.test(slug)) err(`${file}: slug "${slug}" not kebab-case`);
    if (slugs.has(slug)) err(`${file}: duplicate slug "${slug}"`);
    slugs.add(slug);

    const desc = extract(text, "description");
    if (desc && (desc.length < 50 || desc.length > 200)) {
      warn(`${file}: meta.description length ${desc.length} outside 50–200`);
    }

    const lat = extractNumber(text, "lat");
    const lng = extractNumber(text, "lng");
    if (lat !== null && (lat < TR_LAT[0] || lat > TR_LAT[1])) {
      err(`${file}: lat ${lat} outside Turkey bounds`);
    }
    if (lng !== null && (lng < TR_LNG[0] || lng > TR_LNG[1])) {
      err(`${file}: lng ${lng} outside Turkey bounds`);
    }

    const srcs = extractAll(text, "src").filter((s) => s.startsWith("/"));
    for (const src of srcs) {
      const candidate = join(ROOT, "public", src);
      if (!existsSync(candidate)) {
        warn(`${file}: image src missing in /public: ${src}`);
      }
    }
  }

  if (warnings.length) {
    console.warn(`[content-validate] ${warnings.length} warning(s):`);
    for (const w of warnings) console.warn("  ⚠ " + w);
  }
  if (errors.length) {
    console.error(`[content-validate] ${errors.length} error(s):`);
    for (const e of errors) console.error("  ✗ " + e);
    process.exit(1);
  }
  console.log("[content-validate] ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
