import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/content/projects";
import { statusLabel } from "@/content/projects";
import { deliveryLabel } from "@/lib/utils";

/**
 * Proje arşivi kartı. Anasayfa rayı ve detay sayfasındaki ilgili projelerle
 * aynı görsel dili paylaşır; tek fark dikey oranı ve ızgara içinde durması.
 */
export function ProjectCard({ project }: { project: Project }) {
  const delivery = deliveryLabel(
    project.features.find((f) => f.label === "Teslim")?.value
  );

  return (
    <Link
      href={`/projeler/${project.slug}`}
      className="slide-card group"
      aria-label={`${project.name} — ${project.locationLabel}`}
    >
      <div className="slide-card__media">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="slide-card__veil" aria-hidden />
        <span className="slide-card__status">{statusLabel[project.status]}</span>

        <div className="slide-card__body">
          <p className="eyebrow mb-3">
            {project.locationLabel}
            {delivery ? (
              <>
                <span className="slide-card__dot" aria-hidden>
                  ·
                </span>
                <span className="text-white/55">{delivery}</span>
              </>
            ) : null}
          </p>
          <h3
            className="text-[1.6rem] leading-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.name}
          </h3>
          <span className="slide-card__reveal">
            <span className="slide-card__summary">{project.shortSummary}</span>
            <span className="slide-card__rule" aria-hidden />
            <span className="slide-card__cta">
              Detayları incele
              <span aria-hidden>→</span>
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
