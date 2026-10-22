import test from "node:test";
import assert from "node:assert/strict";
import { projects } from "./index";
import { findOrderingProblem, summarizeProgress } from "@/lib/progress";

/**
 * Gerçek proje verisinin ilerleme aşamalarını denetler. Tutarsız sıralama
 * vitrinde "bitti → planlı → bitti" gibi okunur ve güven kaybettirir;
 * bu testle veri yanlışsa derleme değil test düşer.
 */

const withProgress = projects.filter((p) => p.progress);

test("ilerleme verisi olan en az bir proje var", () => {
  assert.ok(withProgress.length > 0, "hiç ilerleme verisi yok; test anlamsızlaşır");
});

test("aşama sıralaması tutarlıdır", () => {
  for (const project of withProgress) {
    const problem = findOrderingProblem(project.progress!.milestones);
    assert.equal(problem, null, `${project.slug}: ${problem}`);
  }
});

test("tamamlanmış projede ilerleme %100'dür", () => {
  for (const project of withProgress.filter((p) => p.status === "completed")) {
    const summary = summarizeProgress(project.progress!.milestones);
    assert.equal(
      summary.percent,
      100,
      `${project.slug} tamamlandı ama ilerleme %${summary.percent}`
    );
  }
});

test("tamamlanmamış projede ilerleme %100 değildir", () => {
  for (const project of withProgress.filter((p) => p.status !== "completed")) {
    const summary = summarizeProgress(project.progress!.milestones);
    assert.ok(
      summary.percent < 100,
      `${project.slug} tamamlanmadı ama ilerleme %100 görünüyor`
    );
  }
});

test("her aşamanın etiketi ve tarihi doldurulmuştur", () => {
  for (const project of withProgress) {
    for (const milestone of project.progress!.milestones) {
      assert.ok(milestone.label.trim(), `${project.slug}: boş aşama etiketi`);
      assert.ok(
        milestone.date?.trim(),
        `${project.slug} / ${milestone.label}: tarih yok`
      );
    }
  }
});

test("aynı aşama iki kez listelenmez", () => {
  for (const project of withProgress) {
    const labels = project.progress!.milestones.map((m) => m.label);
    assert.equal(
      new Set(labels).size,
      labels.length,
      `${project.slug}: tekrar eden aşama var`
    );
  }
});
