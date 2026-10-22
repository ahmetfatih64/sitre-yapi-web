import type { Project } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { summarizeProgress, type MilestoneStatus } from "@/lib/progress";

const STATUS_LABEL: Record<MilestoneStatus, string> = {
  done: "Tamamlandı",
  active: "Sürüyor",
  planned: "Planlandı",
};

/**
 * Aşama işaretçisi. Renkler `style` ile verilir: aynı özgüllükteki iki
 * Tailwind arka plan sınıfı (ör. `bg-white` ve `bg-[…]`) çakışır ve
 * hangisinin kazanacağı sınıf sırasına değil, stil dosyasındaki sıraya
 * bağlıdır — bu da dolu işaretçinin boş görünmesine yol açıyordu.
 */
const MARKER_STYLE: Record<MilestoneStatus, { background: string; borderColor: string }> = {
  done: { background: "var(--color-brand)", borderColor: "var(--color-brand)" },
  active: { background: "var(--color-accent)", borderColor: "var(--color-accent-ink)" },
  planned: { background: "#ffffff", borderColor: "var(--color-border)" },
};

function Marker({ status }: { status: MilestoneStatus }) {
  return (
    <span
      aria-hidden="true"
      className="relative z-10 shrink-0 w-3.5 h-3.5 rounded-full border-2 mt-1.5"
      style={MARKER_STYLE[status]}
    />
  );
}

export function ProjectProgress({ project }: { project: Project }) {
  const progress = project.progress;
  if (!progress || progress.milestones.length === 0) return null;

  const summary = summarizeProgress(progress.milestones);

  return (
    <section className="section bg-[var(--color-bg-alt)]" id="ilerleme">
      <div className="container-page">
        <SectionHeading overline={progress.overline} title={progress.title} />

        <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <p className="display-md" style={{ fontFamily: "var(--font-display)" }}>
            %{summary.percent}
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            {`${summary.total} aşamanın ${summary.doneCount} tanesi tamamlandı`}
          </p>
          {progress.updatedAt && (
            <p className="text-xs text-[var(--color-muted)] ml-auto">
              Son güncelleme: {progress.updatedAt}
            </p>
          )}
        </div>

        <div
          className="mt-4 h-1 w-full bg-[var(--color-border)]"
          role="progressbar"
          aria-valuenow={summary.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${project.name} inşaat ilerlemesi`}
        >
          <div
            className="h-full bg-[var(--color-brand)]"
            style={{ width: `${summary.percent}%` }}
          />
        </div>

        <ol className="mt-12">
          {progress.milestones.map((milestone, index) => (
            <Reveal
              as="li"
              key={milestone.label}
              delay={index * 60}
              /* Boşluk <li> üzerinde: `last:` ancak burada doğru öğeye bakar. */
              className="relative pb-10 last:pb-0"
            >
              {index < progress.milestones.length - 1 && (
                /* Bağlayıcı çizgi tamamlanan kısımda koyu, kalanında soluk. */
                <span
                  aria-hidden="true"
                  className="absolute left-[6px] top-5 bottom-0 w-0.5"
                  style={{
                    background:
                      milestone.status === "done"
                        ? "var(--color-brand)"
                        : "var(--color-border)",
                  }}
                />
              )}
              <div className="flex gap-5">
                <Marker status={milestone.status} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3
                      className={
                        "text-lg " +
                        (milestone.status === "planned"
                          ? "text-[var(--color-muted)]"
                          : "text-[var(--color-brand)]")
                      }
                    >
                      {milestone.label}
                    </h3>
                    <span className="eyebrow">{STATUS_LABEL[milestone.status]}</span>
                    {milestone.date && (
                      <span className="text-xs text-[var(--color-muted)] tabular-nums">
                        {milestone.date}
                      </span>
                    )}
                  </div>
                  {milestone.note && (
                    <p className="mt-2 text-sm text-[var(--color-brand-soft)] max-w-prose">
                      {milestone.note}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
