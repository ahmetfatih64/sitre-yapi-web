import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { getFeaturedProjects } from "@/content/projects";

export function FeaturedProjects() {
  const featured = getFeaturedProjects(3);
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <SectionHeading
            overline="Projeler"
            title="Seçili projelerimiz."
            description="Her projeyi tek tek anlatırız — çünkü hepsi farklı bir yerin, farklı bir fikrin yanıtıdır."
          />
          <Link
            href="/projeler"
            className="btn btn-outline self-start md:self-end"
          >
            Tüm projeleri gör
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
