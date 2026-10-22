"use client";

import Image from "next/image";
import type { Project } from "@/content/projects";
import { FloorPlan } from "@/components/ui/FloorPlan";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { useQuickContact } from "@/components/forms/QuickContactProvider";
import { formatArea } from "@/lib/utils";

type PlanItem = Project["plans"]["items"][number];

/** Her plan bir kolon; metrikler satır satır hizalandığı için karşılaştırılabilir. */
export function PlanComparison({ project }: { project: Project }) {
  const items = project.plans.items;
  const { open } = useQuickContact();

  if (items.length < 2) return null;

  const hasOrientation = items.some((i) => i.orientation);
  const hasFloorRange = items.some((i) => i.floorRange);

  const metrics: { label: string; value: (item: PlanItem) => string }[] = [
    { label: "Tip", value: (i) => i.category },
    { label: "Brüt alan", value: (i) => formatArea(i.totalArea) },
    { label: "Net alan", value: (i) => formatArea(i.netArea) },
    { label: "Bölüm sayısı", value: (i) => `${i.rooms.length}` },
    ...(hasOrientation
      ? [{ label: "Cephe", value: (i: PlanItem) => i.orientation ?? "—" }]
      : []),
    ...(hasFloorRange
      ? [{ label: "Kat", value: (i: PlanItem) => i.floorRange ?? "—" }]
      : []),
  ];

  return (
    <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">
          {`${project.name} plan tiplerinin alan ve bölüm karşılaştırması`}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="w-32" />
            {items.map((item) => (
              <th
                key={item.code}
                scope="col"
                className="p-4 align-bottom text-left border-b border-[var(--color-border)]"
              >
                <span
                  className="block text-xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.code}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th
              scope="row"
              className="p-4 align-top text-left eyebrow border-b border-[var(--color-border)]"
            >
              Plan
            </th>
            {items.map((item) => (
              <td
                key={item.code}
                className="p-4 align-top border-b border-[var(--color-border)]"
              >
                {item.image ? (
                  <div className="relative aspect-[4/3] bg-[var(--color-bg-alt)]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="33vw"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <FloorPlan
                    rooms={item.rooms}
                    orientation={item.orientation}
                    compact
                    className="w-full h-auto"
                  />
                )}
              </td>
            ))}
          </tr>
          {metrics.map((metric) => (
            <tr key={metric.label}>
              <th
                scope="row"
                className="p-4 text-left font-normal text-[var(--color-muted)] border-b border-[var(--color-border)]"
              >
                {metric.label}
              </th>
              {items.map((item) => (
                <td
                  key={item.code}
                  className="p-4 tabular-nums border-b border-[var(--color-border)]"
                >
                  {metric.value(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="sr-only">
              İletişim
            </th>
            {items.map((item) => (
              <td key={item.code} className="p-4 align-top">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      open({
                        project: project.slug,
                        plan: item.code,
                        context: "plan-karsilastirma",
                      })
                    }
                    className="btn btn-primary"
                  >
                    Bilgi al
                  </button>
                  <WhatsAppCta
                    contextLabel={`${project.name} — ${item.code} (${item.category})`}
                    className="btn btn-outline"
                  >
                    WhatsApp
                  </WhatsAppCta>
                </div>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
