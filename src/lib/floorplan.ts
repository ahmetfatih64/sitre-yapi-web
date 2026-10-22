/**
 * Oda alanlarından şematik kat planı yerleşimi üretir.
 *
 * Neden üretiliyor: elle çizilen planlar veriyle sürüklenir — oda m²'si
 * değişince çizim yanlış kalır. Burada kutular alanla orantılı hesaplandığı
 * için plan her zaman veriyle tutarlıdır ve her projede çalışır.
 *
 * Yerleşim "squarified treemap" (Bruls, Huizing, van Wijk) yaklaşımıdır:
 * kutuları olabildiğince kareye yakın tutar, böylece uzun ince şeritler
 * yerine oda gibi okunan dikdörtgenler çıkar.
 *
 * Sonuç şematiktir, ölçekli mimari çizim değildir.
 */

export type Room = { name: string; area: number };

export type PlacedRoom = Room & {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Toplam alandaki payı (0–1). */
  share: number;
};

type Rect = { x: number; y: number; width: number; height: number };

/**
 * Bir satırın en kötü en-boy oranı. Bruls ve ark. formülü:
 * worst(R, w) = max( w²·maks / s² , s² / (w²·min) )
 * Kusursuz kare 1 verir; değer büyüdükçe kutular incelir. Satıra yeni oda
 * eklemek bu değeri kötüleştirdiği anda satır kapatılır.
 */
function worstAspect(areas: number[], length: number, scale: number): number {
  if (areas.length === 0 || length <= 0) return Number.POSITIVE_INFINITY;
  const total = areas.reduce((sum, a) => sum + a, 0) * scale;
  if (total === 0) return Number.POSITIVE_INFINITY;
  const max = Math.max(...areas) * scale;
  const min = Math.min(...areas) * scale;
  const span = length * length;
  return Math.max((span * max) / (total * total), (total * total) / (span * min));
}

function layoutRow(row: Room[], rect: Rect, scale: number, out: PlacedRoom[], totalArea: number): Rect {
  const rowArea = row.reduce((sum, r) => sum + r.area, 0) * scale;
  const horizontal = rect.width >= rect.height;
  const thickness = horizontal ? rowArea / rect.height : rowArea / rect.width;

  let offset = 0;
  for (const room of row) {
    const scaled = room.area * scale;
    const span = thickness === 0 ? 0 : scaled / thickness;
    out.push({
      ...room,
      share: totalArea === 0 ? 0 : room.area / totalArea,
      x: horizontal ? rect.x : rect.x + offset,
      y: horizontal ? rect.y + offset : rect.y,
      width: horizontal ? thickness : span,
      height: horizontal ? span : thickness,
    });
    offset += span;
  }

  return horizontal
    ? { x: rect.x + thickness, y: rect.y, width: rect.width - thickness, height: rect.height }
    : { x: rect.x, y: rect.y + thickness, width: rect.width, height: rect.height - thickness };
}

/**
 * Odaları verilen kutuya yerleştirir. Alanı sıfır veya negatif olanlar elenir;
 * böylece eksik veri yerleşimi bozmaz.
 */
export function layoutFloorPlan(
  rooms: readonly Room[],
  width: number,
  height: number
): PlacedRoom[] {
  const valid = rooms.filter((r) => r.area > 0);
  if (valid.length === 0 || width <= 0 || height <= 0) return [];

  const totalArea = valid.reduce((sum, r) => sum + r.area, 0);
  const scale = (width * height) / totalArea;
  const sorted = [...valid].sort((a, b) => b.area - a.area);

  const placed: PlacedRoom[] = [];
  let rect: Rect = { x: 0, y: 0, width, height };
  let row: Room[] = [];

  for (const room of sorted) {
    const side = Math.min(rect.width, rect.height);
    const current = row.map((r) => r.area);
    const next = [...current, room.area];

    if (row.length > 0 && worstAspect(next, side, scale) > worstAspect(current, side, scale)) {
      rect = layoutRow(row, rect, scale, placed, totalArea);
      row = [room];
    } else {
      row.push(room);
    }
  }
  if (row.length > 0) layoutRow(row, rect, scale, placed, totalArea);

  return placed;
}

/** Pusula yönünü dereceye çevirir; kuzey oku için. Bilinmiyorsa null. */
export function orientationToDegrees(orientation: string | undefined): number | null {
  if (!orientation) return null;
  const normalized = orientation.toLocaleLowerCase("tr").replace(/\s/g, "");
  const table: Record<string, number> = {
    kuzey: 0,
    "kuzey-doğu": 45,
    doğu: 90,
    "güney-doğu": 135,
    güney: 180,
    "güney-batı": 225,
    batı: 270,
    "kuzey-batı": 315,
  };
  return table[normalized] ?? null;
}
