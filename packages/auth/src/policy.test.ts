import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canEditLead,
  canTransitionProject,
  assertCanTransitionProject,
  type Actor,
} from "./policy";
import { ForbiddenError } from "./rbac";

const sales = (id: string): Actor => ({ id, role: "SALES" });
const admin: Actor = { id: "a", role: "ADMIN" };
const owner: Actor = { id: "o", role: "OWNER" };
const editor: Actor = { id: "e", role: "EDITOR" };
const viewer: Actor = { id: "v", role: "VIEWER" };

test("SALES can edit only their assigned lead", () => {
  assert.equal(canEditLead(sales("u1"), { assigneeId: "u1" }), true);
  assert.equal(canEditLead(sales("u1"), { assigneeId: "u2" }), false);
  assert.equal(canEditLead(sales("u1"), { assigneeId: null }), false);
});

test("ADMIN and OWNER bypass assignee check", () => {
  assert.equal(canEditLead(admin, { assigneeId: "someone" }), true);
  assert.equal(canEditLead(owner, { assigneeId: null }), true);
});

test("VIEWER cannot edit any lead", () => {
  assert.equal(canEditLead(viewer, { assigneeId: "v" }), false);
});

test("EDITOR cannot edit leads at all (no lead.update perm)", () => {
  assert.equal(canEditLead(editor, { assigneeId: "e" }), false);
});

test("canTransitionProject — EDITOR can move to DRAFT/IN_REVIEW", () => {
  const proj = { publishState: "DRAFT" as const };
  assert.equal(canTransitionProject(editor, proj, "DRAFT"), true);
  assert.equal(canTransitionProject(editor, proj, "IN_REVIEW"), true);
  assert.equal(canTransitionProject(editor, proj, "PUBLISHED"), false);
  assert.equal(canTransitionProject(editor, proj, "ARCHIVED"), false);
});

test("canTransitionProject — ADMIN can publish and archive", () => {
  const proj = { publishState: "IN_REVIEW" as const };
  assert.equal(canTransitionProject(admin, proj, "PUBLISHED"), true);
  assert.equal(canTransitionProject(admin, proj, "ARCHIVED"), true);
});

test("assertCanTransitionProject throws for VIEWER", () => {
  assert.throws(
    () => assertCanTransitionProject(viewer, { publishState: "DRAFT" }, "PUBLISHED"),
    ForbiddenError
  );
});

test("assertCanTransitionProject silent for OWNER", () => {
  assert.doesNotThrow(() =>
    assertCanTransitionProject(owner, { publishState: "IN_REVIEW" }, "PUBLISHED")
  );
});
