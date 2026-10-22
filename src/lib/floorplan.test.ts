import test from "node:test";
import assert from "node:assert/strict";
import { layoutFloorPlan, orientationToDegrees, type Room } from "./floorplan";

const PLAN: Room[] = [
  { name: "Salon", area: 44 },
  { name: "Yatak odası 1", area: 22 },
  { name: "Mutfak", area: 18 },
  { name: "Yatak odası 2", area: 16 },
  { name: "Çalışma", area: 12 },
  { name: "Banyo", area: 8 },
];

const W = 900;
const H = 600;

function overlaps(a: { x: number; y: number; width: number; height: number }, b: typeof a): boolean {
  const gap = 0.001;
  return (
    a.x + a.width - gap > b.x &&
    b.x + b.width - gap > a.x &&
    a.y + a.height - gap > b.y &&
    b.y + b.height - gap > a.y
  );
}

test("yerleştirilen kutular tuvali tam doldurur", () => {
  const placed = layoutFloorPlan(PLAN, W, H);
  const area = placed.reduce((sum, r) => sum + r.width * r.height, 0);
  assert.ok(Math.abs(area - W * H) < 1, `beklenen ${W * H}, gelen ${area}`);
});

test("hiçbir oda bir diğeriyle çakışmaz", () => {
  const placed = layoutFloorPlan(PLAN, W, H);
  for (let i = 0; i < placed.length; i += 1) {
    const a = placed[i];
    assert.ok(a);
    for (let j = i + 1; j < placed.length; j += 1) {
      const b = placed[j];
      assert.ok(b);
      assert.ok(!overlaps(a, b), `${a.name} ile ${b.name} çakışıyor`);
    }
  }
});

test("tüm odalar tuval sınırları içinde kalır", () => {
  const placed = layoutFloorPlan(PLAN, W, H);
  for (const room of placed) {
    assert.ok(room.x >= -0.001 && room.y >= -0.001, `${room.name} negatif konumda`);
    assert.ok(room.x + room.width <= W + 0.001, `${room.name} genişlik taşması`);
    assert.ok(room.y + room.height <= H + 0.001, `${room.name} yükseklik taşması`);
    assert.ok(room.width > 0 && room.height > 0, `${room.name} sıfır alanlı`);
  }
});

test("kutu alanı oda m²'siyle orantılıdır", () => {
  const placed = layoutFloorPlan(PLAN, W, H);
  const total = PLAN.reduce((sum, r) => sum + r.area, 0);
  for (const room of placed) {
    const expected = (room.area / total) * W * H;
    const actual = room.width * room.height;
    assert.ok(
      Math.abs(actual - expected) / expected < 0.001,
      `${room.name}: beklenen ${expected.toFixed(0)}, gelen ${actual.toFixed(0)}`
    );
  }
});

test("her oda bir kez yerleştirilir", () => {
  const placed = layoutFloorPlan(PLAN, W, H);
  assert.equal(placed.length, PLAN.length);
  assert.deepEqual(
    [...placed.map((r) => r.name)].sort(),
    [...PLAN.map((r) => r.name)].sort()
  );
});

test("pay değerleri toplamda 1 eder", () => {
  const placed = layoutFloorPlan(PLAN, W, H);
  const sum = placed.reduce((acc, r) => acc + r.share, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9, `toplam pay ${sum}`);
});

test("alanı olmayan odalar elenir, yerleşimi bozmaz", () => {
  const placed = layoutFloorPlan([...PLAN, { name: "Eksik", area: 0 }, { name: "Hatalı", area: -5 }], W, H);
  assert.equal(placed.length, PLAN.length);
  assert.ok(!placed.some((r) => r.name === "Eksik" || r.name === "Hatalı"));
});

test("boş girdi ve geçersiz boyut boş dizi döner", () => {
  assert.deepEqual(layoutFloorPlan([], W, H), []);
  assert.deepEqual(layoutFloorPlan(PLAN, 0, H), []);
  assert.deepEqual(layoutFloorPlan(PLAN, W, -1), []);
});

test("tek oda tuvalin tamamını kaplar", () => {
  const placed = layoutFloorPlan([{ name: "Stüdyo", area: 55 }], W, H);
  const only = placed[0];
  assert.equal(placed.length, 1);
  assert.ok(only);
  assert.ok(Math.abs(only.width - W) < 0.001);
  assert.ok(Math.abs(only.height - H) < 0.001);
});

test("kutular makul en-boy oranında kalır (ince şerit üretmez)", () => {
  const placed = layoutFloorPlan(PLAN, W, H);
  for (const room of placed) {
    const ratio = Math.max(room.width / room.height, room.height / room.width);
    assert.ok(ratio < 5, `${room.name} oranı ${ratio.toFixed(1)} — okunamayacak kadar ince`);
  }
});

test("girdi dizisi değiştirilmez", () => {
  const input: Room[] = [...PLAN];
  const snapshot = JSON.stringify(input);
  layoutFloorPlan(input, W, H);
  assert.equal(JSON.stringify(input), snapshot);
});

test("yön adı dereceye çevrilir", () => {
  assert.equal(orientationToDegrees("Kuzey"), 0);
  assert.equal(orientationToDegrees("Güney-Batı"), 225);
  assert.equal(orientationToDegrees("Doğu"), 90);
});

test("yön çevirisi Türkçe büyük harfte de çalışır", () => {
  // "GÜNEY-BATI".toLowerCase() İ/ı tuzağına düşer; locale'li katlama şart.
  assert.equal(orientationToDegrees("GÜNEY-BATI"), 225);
  assert.equal(orientationToDegrees("BATI"), 270);
});

test("bilinmeyen veya eksik yön null döner", () => {
  assert.equal(orientationToDegrees(undefined), null);
  assert.equal(orientationToDegrees("Yukarı"), null);
});
