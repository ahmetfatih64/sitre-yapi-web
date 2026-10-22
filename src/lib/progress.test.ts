import test from "node:test";
import assert from "node:assert/strict";
import { findOrderingProblem, summarizeProgress, type Milestone } from "./progress";

const m = (label: string, status: Milestone["status"]): Milestone => ({ label, status });

test("boş liste sıfır ilerleme verir", () => {
  const s = summarizeProgress([]);
  assert.equal(s.percent, 0);
  assert.equal(s.activeIndex, -1);
  assert.equal(s.isComplete, false);
});

test("hepsi bitmişse yüzde 100 ve tamamlanmış sayılır", () => {
  const s = summarizeProgress([m("a", "done"), m("b", "done")]);
  assert.equal(s.percent, 100);
  assert.equal(s.isComplete, true);
  assert.equal(s.activeIndex, -1);
});

test("hiçbiri başlamamışsa yüzde sıfırdır", () => {
  const s = summarizeProgress([m("a", "planned"), m("b", "planned")]);
  assert.equal(s.percent, 0);
  assert.equal(s.isComplete, false);
});

test("süren aşama yarım sayılır", () => {
  // 1 bitti + 1 sürüyor (0.5) / 4 = %37.5 → 38
  const s = summarizeProgress([
    m("a", "done"),
    m("b", "active"),
    m("c", "planned"),
    m("d", "planned"),
  ]);
  assert.equal(s.doneCount, 1);
  assert.equal(s.activeIndex, 1);
  assert.equal(s.percent, 38);
});

test("süren aşama yüzdeyi bitmiş saymaz", () => {
  const sadeceAktif = summarizeProgress([m("a", "active"), m("b", "planned")]);
  assert.ok(sadeceAktif.percent > 0, "başlamış iş sıfır görünmemeli");
  assert.ok(sadeceAktif.percent < 50, "süren aşama bitmiş sayılmamalı");
  assert.equal(sadeceAktif.isComplete, false);
});

test("tek aşamalı proje bitince 100 olur", () => {
  assert.equal(summarizeProgress([m("tek", "done")]).percent, 100);
});

test("tutarlı sıralamada sorun bildirilmez", () => {
  assert.equal(
    findOrderingProblem([m("a", "done"), m("b", "active"), m("c", "planned")]),
    null
  );
  assert.equal(findOrderingProblem([]), null);
});

test("planlıdan sonra gelen bitmiş aşama yakalanır", () => {
  const problem = findOrderingProblem([
    m("a", "done"),
    m("b", "planned"),
    m("c", "done"),
  ]);
  assert.match(problem ?? "", /"c" bitmiş görünüyor/);
});

test("birden fazla süren aşama yakalanır", () => {
  const problem = findOrderingProblem([m("a", "active"), m("b", "active")]);
  assert.match(problem ?? "", /2 aşama sürüyor/);
});
