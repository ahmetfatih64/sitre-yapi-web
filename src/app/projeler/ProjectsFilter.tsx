"use client";

import { useState } from "react";
import type { Project } from "@/content/projects";
import { statusLabel } from "@/content/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";

type FilterKey = "all" | "active" | "upcoming" | "completed";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "active", label: statusLabel.active },
  { key: "upcoming", label: statusLabel.upcoming },
  { key: "completed", label: statusLabel.completed },
];

export function ProjectsFilter({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const visible =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <section className="pb-32">
      <div className="container-page">
        <div className="flex flex-wrap gap-2 mb-12 border-b border-[var(--color-border)] pb-6">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={
                "px-5 py-3 text-xs uppercase tracking-[0.14em] border transition-colors " +
                (filter === f.key
                  ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-brand)]")
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="text-[var(--color-brand-soft)] py-16">
            Bu filtre için şu an uygun proje bulunmuyor.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {visible.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
