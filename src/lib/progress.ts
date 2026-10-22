/**
 * Proje ilerleme hesabı.
 *
 * Yüzde elle girilmez, aşamalardan türetilir. Elle girilseydi aşamalar
 * güncellenince yüzde geride kalır ve vitrin veriyle çelişirdi.
 */

export type MilestoneStatus = "done" | "active" | "planned";

export type Milestone = {
  label: string;
  status: MilestoneStatus;
  /** Biten aşamada gerçekleşen, planlıda öngörülen tarih. */
  date?: string;
  note?: string;
};

export type ProgressSummary = {
  doneCount: number;
  total: number;
  /** 0–100 arası tam sayı. Süren aşama yarım sayılır. */
  percent: number;
  /** Süren aşamanın sırası; yoksa -1. */
  activeIndex: number;
  isComplete: boolean;
};

/**
 * Süren aşama yarım sayılır: tamamen bitmemiştir ama başlamıştır.
 * Böylece tek bir aşama sürerken yüzde sıçramadan ilerler.
 */
export function summarizeProgress(
  milestones: readonly Milestone[]
): ProgressSummary {
  const total = milestones.length;
  if (total === 0) {
    return { doneCount: 0, total: 0, percent: 0, activeIndex: -1, isComplete: false };
  }

  const doneCount = milestones.filter((m) => m.status === "done").length;
  const activeIndex = milestones.findIndex((m) => m.status === "active");
  const weighted = doneCount + (activeIndex >= 0 ? 0.5 : 0);

  return {
    doneCount,
    total,
    percent: Math.round((weighted / total) * 100),
    activeIndex,
    isComplete: doneCount === total,
  };
}

/**
 * Aşama sıralamasının tutarlı olup olmadığını söyler: biten bir aşama,
 * planlı bir aşamadan sonra gelmemelidir. Tutarsız veri vitrinde
 * "bitti → planlı → bitti" gibi okunur ve güven kaybettirir.
 */
export function findOrderingProblem(
  milestones: readonly Milestone[]
): string | null {
  let seenNonDone = false;
  for (const milestone of milestones) {
    if (milestone.status === "done") {
      if (seenNonDone) {
        return `"${milestone.label}" bitmiş görünüyor ama kendisinden önce bitmemiş bir aşama var`;
      }
    } else {
      seenNonDone = true;
    }
  }

  const activeCount = milestones.filter((m) => m.status === "active").length;
  if (activeCount > 1) {
    return `aynı anda ${activeCount} aşama sürüyor olamaz`;
  }

  return null;
}
