import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "./index";
import { projectSchema, parseProject } from "./schema";

/**
 * Zod şeması, depodaki TS içeriğinin birebir aynası olmalı. Ayrışırlarsa
 * veritabanından okunan kayıtlar sessizce reddedilmeye başlar.
 */
test("depodaki tüm projeler şemayı geçer", () => {
  for (const project of projects) {
    const result = projectSchema.safeParse(project);
    assert.equal(
      result.success,
      true,
      `${project.slug} şemayı geçemedi: ${
        result.success
          ? ""
          : JSON.stringify(result.error.issues.slice(0, 3), null, 1)
      }`
    );
  }
});

test("şema JSON turundan sonra da geçerli kalır", () => {
  // Veritabanı yolunda içerik JSONB olarak saklanıp geri okunuyor.
  for (const project of projects) {
    const roundTripped: unknown = JSON.parse(JSON.stringify(project));
    assert.notEqual(parseProject(roundTripped, "test"), null);
  }
});

test("parseProject bozuk kayıtta null döner, patlamaz", () => {
  assert.equal(parseProject({ slug: "eksik" }, "test"), null);
  assert.equal(parseProject(null, "test"), null);
  assert.equal(parseProject("metin değil nesne", "test"), null);
});
