import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectsFilter } from "./ProjectsFilter";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projeler",
  path: "/projeler",
  description:
    "Sitre Yapı'nın aktif, tamamlanmış ve yakında satışa çıkacak projeleri.",
});

export default function ProjelerPage() {
  return (
    <>
      <section className="section pt-40">
        <div className="container-page">
          <SectionHeading
            overline="Projelerimiz"
            title="Her proje kendi yerinin yanıtıdır."
            description="Aktif satışta, yakında ve tamamlanmış projelerimizi inceleyin."
            as="h1"
            size="xl"
          />
        </div>
      </section>

      <ProjectsFilter projects={projects} />

      <CtaBand
        overline="Özel talep"
        title="Arıyor ama bulamadığınız bir şey mi var?"
        description="Özel taleplerinizi dinleyelim; size uygun bir yön çizelim."
        primaryLabel="Size ulaşalım"
      />
    </>
  );
}

