import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projeler/${project.slug}`}
      className="card-project group block"
      aria-label={`${project.name} — ${project.locationLabel}`}
    >
      <div className="card-project__media relative">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="pt-5 pb-6 px-1">
        <p className="eyebrow mb-2">{project.locationLabel}</p>
        <h3
          className="text-2xl leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.name}
        </h3>
        <p className="text-sm text-[var(--color-brand-soft)] mt-3 max-w-sm">
          {project.shortSummary}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] group-hover:gap-3 transition-all">
          Detayları incele
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
