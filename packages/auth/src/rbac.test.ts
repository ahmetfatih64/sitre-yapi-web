import { test } from "node:test";
import assert from "node:assert/strict";
import { can, assertCan, ForbiddenError, ROLE_PERMISSIONS } from "./rbac";

test("OWNER has settings.update and user.update_role", () => {
  assert.equal(can("OWNER", "settings.update"), true);
  assert.equal(can("OWNER", "user.update_role"), true);
});

test("ADMIN cannot update roles or settings", () => {
  assert.equal(can("ADMIN", "user.update_role"), false);
  assert.equal(can("ADMIN", "settings.update"), false);
  assert.equal(can("ADMIN", "project.publish"), true);
  assert.equal(can("ADMIN", "media.delete"), true);
});

test("EDITOR can draft and upload but not publish", () => {
  assert.equal(can("EDITOR", "project.draft"), true);
  assert.equal(can("EDITOR", "media.upload"), true);
  assert.equal(can("EDITOR", "project.publish"), false);
  assert.equal(can("EDITOR", "media.delete"), false);
});

test("SALES sees leads but no content write", () => {
  assert.equal(can("SALES", "lead.assign"), true);
  assert.equal(can("SALES", "lead.export"), true);
  assert.equal(can("SALES", "project.draft"), false);
});

test("VIEWER is strictly read-only on projects and leads", () => {
  assert.equal(can("VIEWER", "project.read"), true);
  assert.equal(can("VIEWER", "lead.read"), true);
  assert.equal(can("VIEWER", "project.draft"), false);
  assert.equal(can("VIEWER", "lead.assign"), false);
});

test("null/undefined role fails closed", () => {
  assert.equal(can(null, "project.read"), false);
  assert.equal(can(undefined, "lead.read"), false);
});

test("ROLE_PERMISSIONS has all five roles", () => {
  assert.deepEqual(
    Object.keys(ROLE_PERMISSIONS).sort(),
    ["ADMIN", "EDITOR", "OWNER", "SALES", "VIEWER"]
  );
});

test("assertCan throws ForbiddenError when denied", () => {
  assert.throws(() => assertCan("VIEWER", "project.publish"), ForbiddenError);
});

test("assertCan is silent when allowed", () => {
  assert.doesNotThrow(() => assertCan("OWNER", "settings.update"));
});
