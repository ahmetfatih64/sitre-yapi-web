import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  getProjectBySlug,
  getRelatedProjects,
  listProjectSlugs,
} from "@/content/projects/service";
import { Hero } from "@/components/sections/Hero";
import { CtaBand } from "@/components/sections/CtaBand";
import { VirtualTour } from "@/components/sections/VirtualTour";
import { ProjectProgress } from "@/components/sections/ProjectProgress";
import { PrintCover } from "@/components/print/PrintCover";
import { PrintButton } from "@/components/ui/PrintButton";
import {
  ProjectConcept,
  ProjectLocation,
  ProjectFeatureBand,
  ProjectGallery,
  ProjectAmenities,
  ProjectSitePlan,
  ProjectPlans,
  RelatedProjects,
} from "@/components/sections/ProjectDetailSections";
import {
  buildMetadata,
  breadcrumbJsonLd,
  realEstateListingJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/content/site.config";
import { serializeJsonLd } from "@/lib/json-ld";

export async function generateStaticParams() {
  const slugs = await listProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return buildMetadata({ title: "Proje", path: `/projeler/${slug}` });
  return buildMetadata({
    title: `${project.name} — ${project.locationLabel}`,
    path: `/projeler/${project.slug}`,
    description: project.meta.description,
    ...(project.meta.ogImage ? { image: project.meta.ogImage } : {}),
  });
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(project.slug, 2);

  const residenceLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.name,
    description: project.meta.description,
    url: `${siteConfig.url}/projeler/${project.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: project.location.address,
      addressLocality: project.locationLabel.split("—").pop()?.trim() ?? "",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: project.location.coordinates.lat,
      longitude: project.location.coordinates.lng,
    },
  };

  const listingLd = realEstateListingJsonLd(project);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "Projeler", path: "/projeler" },
    { name: project.name, path: `/projeler/${project.slug}` },
  ]);

  return (
    <>
      <Hero
        overline={project.hero.overline}
        title={project.hero.title}
        subtitle={project.hero.subtitle}
        primaryLabel={project.hero.primaryCtaLabel}
        {...(project.hero.secondaryCtaLabel
          ? {
              secondaryLabel: project.hero.secondaryCtaLabel,
              secondaryHref: "#galeri",
            }
          : {})}
        backgroundImage={project.hero.image.src}
        variant="project"
      />
      <PrintCover project={project} />
      <div className="container-page pt-10 flex flex-wrap gap-3" data-print="hide">
        <PrintButton />
      </div>
      <ProjectConcept project={project} />
      <ProjectLocation project={project} />
      <ProjectFeatureBand project={project} />
      <ProjectProgress project={project} />
      <ProjectGallery project={project} />
      <ProjectAmenities project={project} />
      <ProjectSitePlan project={project} />
      <ProjectPlans project={project} />
      {project.tour && <VirtualTour tour={project.tour} />}
      <CtaBand
        title={project.bottomCta.title}
        description={project.bottomCta.description}
        primaryLabel={project.bottomCta.primaryCtaLabel}
        secondaryLabel={project.bottomCta.secondaryCtaLabel}
        secondaryHref="/projeler"
      />
      <RelatedProjects projects={related} />
      <Script
        id={`ld-residence-${project.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(residenceLd) }}
      />
      <Script
        id={`ld-listing-${project.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(listingLd) }}
      />
      <Script
        id={`ld-breadcrumb-${project.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }}
      />
    </>
  );
}
