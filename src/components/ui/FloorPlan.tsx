"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { layoutFloorPlan, orientationToDegrees, type Room } from "@/lib/floorplan";

const VIEW_WIDTH = 900;
const VIEW_HEIGHT = 620;
/** Odaları içe çekince aradaki koyu zemin duvar gibi okunur. */
const WALL = 4;
/**
 * Metin viewBox birimindedir ve SVG kucuduğunde birlikte kucuulur.
 * Bu yuzden iki olcek: genis tek plan gorunumu ve kucuk karsilastirma plani.
 */
const TYPE_SCALE = {
  normal: { name: 21, area: 17, minWidth: 108, minHeight: 62 },
  compact: { name: 32, area: 26, minWidth: 190, minHeight: 104 },
} as const;

type RoomTone = "living" | "sleeping" | "kitchen" | "wet" | "work" | "outdoor" | "other";

const TONES: Record<RoomTone, { fill: string; active: string }> = {
  living: { fill: "#ebdfc4", active: "#dcc79b" },
  sleeping: { fill: "#e5e2d8", active: "#d1ccbb" },
  kitchen: { fill: "#dae3da", active: "#c2d0c2" },
  wet: { fill: "#d6dfe7", active: "#b8c9d8" },
  work: { fill: "#e9e3d7", active: "#d7cdba" },
  outdoor: { fill: "#dde8d6", active: "#c4d6b9" },
  other: { fill: "#e7e4df", active: "#d4cfc7" },
};

/** Oda adından işlev çıkarır; renk dekoratif değil, ıslak/yaşam ayrımını taşır. */
export function roomTone(name: string): RoomTone {
  const n = name.toLocaleLowerCase("tr");
  if (n.includes("salon") || n.includes("oturma") || n.includes("yaşam")) return "living";
  if (n.includes("yatak") || n.includes("ebeveyn")) return "sleeping";
  if (n.includes("mutfak")) return "kitchen";
  if (n.includes("banyo") || n.includes("wc") || n.includes("tuvalet") || n.includes("lavabo")) return "wet";
  if (n.includes("çalışma") || n.includes("ofis") || n.includes("kitaplık")) return "work";
  if (n.includes("balkon") || n.includes("teras") || n.includes("bahçe") || n.includes("veranda")) return "outdoor";
  return "other";
}

function formatArea(value: number): string {
  return `${value.toLocaleString("tr-TR")} m²`;
}

function NorthArrow({ degrees }: { degrees: number }) {
  return (
    <g transform={`translate(${VIEW_WIDTH - 54} 54)`} aria-hidden="true">
      <circle r="26" fill="rgba(255,255,255,0.92)" stroke="#2b2a28" strokeWidth="1" />
      <g transform={`rotate(${degrees})`}>
        <path d="M0 -17 L5.5 6 L0 2.5 L-5.5 6 Z" fill="#2b2a28" />
      </g>
      <text y="-30" textAnchor="middle" fontSize="10" fill="#2b2a28" letterSpacing="1.4">
        K
      </text>
    </g>
  );
}

type FloorPlanProps = {
  rooms: readonly Room[];
  orientation?: string;
  /** Vurgulanan oda adı; oda listesiyle iki yönlü eşlenir. */
  activeRoom?: string | null;
  onActiveRoomChange?: (name: string | null) => void;
  /** Küçük boyutta gösterilecekse etiketler okunur kalsın diye büyütülür. */
  compact?: boolean;
  className?: string;
};

export function FloorPlan({
  rooms,
  orientation,
  activeRoom = null,
  onActiveRoomChange,
  compact = false,
  className,
}: FloorPlanProps) {
  const type = compact ? TYPE_SCALE.compact : TYPE_SCALE.normal;
  const titleId = useId();
  const placed = useMemo(
    () => layoutFloorPlan(rooms, VIEW_WIDTH, VIEW_HEIGHT),
    [rooms]
  );
  const north = orientationToDegrees(orientation);

  if (placed.length === 0) return null;

  const total = placed.reduce((sum, r) => sum + r.area, 0);

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className={className}
      role="img"
      aria-labelledby={titleId}
      onMouseLeave={() => onActiveRoomChange?.(null)}
    >
      <title id={titleId}>
        {`Şematik kat planı: ${placed.length} bölüm, toplam ${formatArea(total)}`}
      </title>

      {/* Koyu zemin; odalar içe çekildiği için aralar duvar olarak görünür. */}
      <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="#2b2a28" />

      {placed.map((room) => {
        const tone = TONES[roomTone(room.name)];
        const isActive = activeRoom === room.name;
        const x = room.x + WALL / 2;
        const y = room.y + WALL / 2;
        const w = Math.max(room.width - WALL, 1);
        const h = Math.max(room.height - WALL, 1);
        const showLabel = w >= type.minWidth && h >= type.minHeight;
        const cx = x + w / 2;
        const cy = y + h / 2;

        return (
          <g
            key={room.name}
            onMouseEnter={() => onActiveRoomChange?.(room.name)}
            style={{ cursor: onActiveRoomChange ? "pointer" : "default" }}
          >
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={isActive ? tone.active : tone.fill}
              style={{ transition: "fill 180ms ease" }}
            />
            {isActive && (
              <rect
                x={x + 3}
                y={y + 3}
                width={Math.max(w - 6, 1)}
                height={Math.max(h - 6, 1)}
                fill="none"
                stroke="#8a6718"
                strokeWidth="2"
              />
            )}
            {showLabel ? (
              <>
                <text
                  x={cx}
                  y={cy - type.area * 0.3}
                  textAnchor="middle"
                  fontSize={type.name}
                  fill="#2b2a28"
                  className="fp-name"
                  style={{ letterSpacing: "0.02em" }}
                >
                  {room.name}
                </text>
                <text
                  x={cx}
                  y={cy + type.name}
                  textAnchor="middle"
                  fontSize={type.area}
                  fill="#6b665e"
                  className="fp-area tabular-nums"
                >
                  {formatArea(room.area)}
                </text>
              </>
            ) : (
              <text
                x={cx}
                y={cy + type.area * 0.36}
                textAnchor="middle"
                fontSize={type.area}
                fill="#2b2a28"
                className="fp-area"
              >
                {formatArea(room.area)}
              </text>
            )}
          </g>
        );
      })}

      {north !== null && <NorthArrow degrees={north} />}
    </svg>
  );
}

type PlanExplorerProps = {
  rooms: readonly Room[];
  orientation?: string;
  /** Gerçek mimari çizim; verilirse üretilen şema yerine o gösterilir. */
  image?: { src: string; alt: string };
};

/**
 * Plan görselini ve oda dökümünü birlikte sunar. Gerçek çizim yoksa
 * şematik plan üretilir ve liste ile karşılıklı vurgulanır.
 */
export function PlanExplorer({ rooms, orientation, image }: PlanExplorerProps) {
  const [active, setActive] = useState<string | null>(null);
  const usable = rooms.filter((r) => r.area > 0);

  if (usable.length === 0) return null;

  return (
    <div>
      {image ? (
        <div className="relative aspect-[4/3] bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain"
          />
        </div>
      ) : (
        <>
          <FloorPlan
            rooms={usable}
            orientation={orientation}
            activeRoom={active}
            onActiveRoomChange={setActive}
            className="w-full h-auto border border-[var(--color-border)]"
          />
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            Şematik gösterim — bölümler alanlarıyla orantılıdır, ölçekli mimari çizim değildir.
          </p>
        </>
      )}
      <p className="eyebrow mt-7 mb-2">Oda dağılımı</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
        {usable.map((room) => {
          const isActive = active === room.name;
          return (
            <li key={room.name}>
              <button
                type="button"
                onMouseEnter={() => setActive(room.name)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(room.name)}
                onBlur={() => setActive(null)}
                aria-pressed={isActive}
                className={
                  "w-full flex items-baseline justify-between gap-3 py-1.5 px-2 -mx-2 text-left transition-colors " +
                  (isActive ? "bg-[var(--color-bg-alt)]" : "hover:bg-[var(--color-bg-alt)]")
                }
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-2.5 h-2.5"
                    style={{ background: TONES[roomTone(room.name)].active }}
                  />
                  <span className="truncate text-[var(--color-brand-soft)]">{room.name}</span>
                </span>
                <span className="tabular-nums shrink-0">{formatArea(room.area)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
