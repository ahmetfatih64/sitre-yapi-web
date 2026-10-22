import type { Project } from "@/content/projects";
import { PlanExplorer } from "@/components/ui/FloorPlan";
import { formatArea } from "@/lib/utils";

/**
 * Yalnızca baskıda görünen plan föyleri.
 *
 * Ekrandaki plan bölümü kategori süzgecine bağlıdır ve tek seferde yalnızca
 * seçili tipi gösterir; katalogda ise tüm tipler bulunmalıdır. Bu blok
 * süzgeçten bağımsız olarak her planı basar ve etkileşimli denetim
 * (süzgeç, karşılaştır, CTA) içermez.
 */
export function PlanSheets({ project }: { project: Project }) {
  const items = project.plans.items;
  if (items.length === 0) return null;

  return (
    <section className="print-only print-plans">
      <h2 className="print-plans__heading">{project.plans.title}</h2>
      {items.map((item) => (
        <article key={item.code} className="print-plans__item">
          <header className="print-plans__header">
            <h3>{item.code}</h3>
            <p>{item.category}</p>
          </header>

          <PlanExplorer
            rooms={item.rooms}
            orientation={item.orientation}
            image={item.image}
          />

          <dl className="print-plans__facts">
            <div>
              <dt>Brüt alan</dt>
              <dd>{formatArea(item.totalArea)}</dd>
            </div>
            <div>
              <dt>Net alan</dt>
              <dd>{formatArea(item.netArea)}</dd>
            </div>
            {item.orientation && (
              <div>
                <dt>Cephe</dt>
                <dd>{item.orientation}</dd>
              </div>
            )}
            {item.floorRange && (
              <div>
                <dt>Kat</dt>
                <dd>{item.floorRange}</dd>
              </div>
            )}
          </dl>
        </article>
      ))}
    </section>
  );
}
