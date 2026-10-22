import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProjects } from "@/content/projects/service";
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

export default async function ProjelerPage() {
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

      {/* useSearchParams Suspense sınırı ister; sayfa statik üretildiği için şart. */}
      <Suspense fallback={<div className="container-page pb-32" />}>
        <ProjectsFilter projects={await getAllProjects()} />
      </Suspense>

      <CtaBand
        overline="Özel talep"
        title="Arıyor ama bulamadığınız bir şey mi var?"
        description="Özel taleplerinizi dinleyelim; size uygun bir yön çizelim."
        primaryLabel="Size ulaşalım"
      />
    </>
  );
}

