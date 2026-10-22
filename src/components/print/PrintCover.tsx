import type { Project } from "@/content/projects";
import { siteConfig } from "@/content/site.config";
import { statusLabel } from "@/content/projects";
import { summarizeProgress } from "@/lib/progress";

/**
 * Yalnızca baskıda görünen kapak.
 *
 * Ekrandaki kahraman bölümü video/büyük görsel üzerine kuruludur ve kağıtta
 * işe yaramaz; baskıda o gizlenip bunun yerine bu künye basılır.
 */
export function PrintCover({ project }: { project: Project }) {
  const progress = project.progress
    ? summarizeProgress(project.progress.milestones)
    : null;

  return (
    <section className="print-only print-cover" aria-hidden="true">
      <p className="print-cover__brand">{siteConfig.name}</p>
      <h1 className="print-cover__title">{project.name}</h1>
      <p className="print-cover__meta">
        {project.locationLabel} · {statusLabel[project.status]}
      </p>

      <dl className="print-cover__facts">
        {project.features.map((feature) => (
          <div key={feature.label}>
            <dt>{feature.label}</dt>
            <dd>{feature.value}</dd>
          </div>
        ))}
        {progress && (
          <div>
            <dt>İnşaat ilerlemesi</dt>
            <dd>%{progress.percent}</dd>
          </div>
        )}
      </dl>

      <p className="print-cover__contact">
        {siteConfig.legal.companyName} · {siteConfig.contact.phone} ·{" "}
        {siteConfig.contact.email}
        <br />
        {siteConfig.contact.address.street}, {siteConfig.contact.address.city}
      </p>
      <p className="print-cover__note">
        Görseller ve plan şemaları temsilîdir; bağlayıcı belge niteliği taşımaz.
      </p>
    </section>
  );
}
