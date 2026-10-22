import test from "node:test";
import assert from "node:assert/strict";
import { pickPanorama } from "./pannellum";

const WIDE = "/images/tour/panorama-4k.jpg";
const NARROW = "/images/tour/panorama-2k.jpg";
const base = { wide: WIDE, narrow: NARROW };

test("geniş ekran ve yeterli doku sınırında büyük panorama seçilir", () => {
  assert.equal(
    pickPanorama({ ...base, viewportWidth: 1440, maxTexture: 8192 }),
    WIDE
  );
});

test("doku sınırı panorama genişliğinin altındaysa küçük sürüm seçilir", () => {
  // 2048 sınırlı GPU'da 4096'lık doku boş/bozuk görüntü verir.
  assert.equal(
    pickPanorama({ ...base, viewportWidth: 1440, maxTexture: 2048 }),
    NARROW
  );
});

test("doku sınırı tam panorama genişliğine eşitse büyük sürüm seçilir", () => {
  assert.equal(
    pickPanorama({ ...base, viewportWidth: 1440, maxTexture: 4096 }),
    WIDE
  );
});

test("dar ekranda bant genişliği için küçük sürüm seçilir", () => {
  assert.equal(
    pickPanorama({ ...base, viewportWidth: 375, maxTexture: 8192 }),
    NARROW
  );
});

test("doku sınırı okunamadığında ekran genişliğine göre karar verilir", () => {
  // maxTexture 0 = WebGL sorgulanamadı; sınır yokmuş gibi davranılmamalı.
  assert.equal(
    pickPanorama({ ...base, viewportWidth: 1440, maxTexture: 0 }),
    WIDE
  );
  assert.equal(
    pickPanorama({ ...base, viewportWidth: 375, maxTexture: 0 }),
    NARROW
  );
});

test("panorama genişliği dışarıdan verilebilir", () => {
  assert.equal(
    pickPanorama({ ...base, viewportWidth: 1440, maxTexture: 4096, wideWidth: 8192 }),
    NARROW
  );
});
