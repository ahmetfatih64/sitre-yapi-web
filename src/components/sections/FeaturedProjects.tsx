import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectSlider } from "@/components/sections/ProjectSlider";
import { getFeaturedProjects } from "@/content/projects/service";

export async function FeaturedProjects() {
  const featured = await getFeaturedProjects(3);
  return (
    <section className="section dark-section grain relative overflow-hidden pb-16 lg:pb-24">
      <div className="container-page relative z-[2]">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 lg:mb-20">
            <SectionHeading
              tone="dark"
              overline="Projeler"
              title="Seçili projelerimiz."
              description="Her projeyi tek tek anlatırız — çünkü hepsi farklı bir yerin, farklı bir fikrin yanıtıdır."
            />
            <Link
              href="/projeler"
              className="btn btn-on-dark self-start md:self-end shrink-0"
            >
              Tüm projeleri gör
            </Link>
          </div>
        </Reveal>
      </div>

      <Reveal delay={120} className="relative z-[2]">
        <ProjectSlider projects={featured} />
      </Reveal>
    </section>
  );
}
