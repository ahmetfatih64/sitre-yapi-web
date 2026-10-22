import { test } from "node:test";
import assert from "node:assert/strict";
import { deliveryLabel, formatArea } from "./utils";

test("deliveryLabel tanımsız değer için hiçbir şey döndürmez", () => {
  assert.equal(deliveryLabel(undefined), undefined);
  assert.equal(deliveryLabel(""), undefined);
});

test("deliveryLabel çeyrek biçimli değere 'Teslim' öneki ekler", () => {
  assert.equal(deliveryLabel("2027 Q4"), "Teslim 2027 Q4");
  assert.equal(deliveryLabel("2028 Q2"), "Teslim 2028 Q2");
});

test("deliveryLabel zaten 'Teslim' içeren değeri tekrarlamaz", () => {
  // İçerikte bu biçim de kullanılıyor; önek koşulsuz eklenirse
  // "Teslim Teslim edildi (2024)" gibi bir künye çıkıyordu.
  assert.equal(deliveryLabel("Teslim edildi (2024)"), "Teslim edildi (2024)");
});

test("deliveryLabel büyük/küçük harfe duyarsız eşleşir", () => {
  assert.equal(deliveryLabel("TESLİM EDİLDİ"), "TESLİM EDİLDİ");
  assert.equal(deliveryLabel("teslim bekliyor"), "teslim bekliyor");
});

test("formatArea metrekareyi Türkçe ayırıcıyla biçimlendirir", () => {
  assert.equal(formatArea(1250), "1.250 m²");
  assert.equal(formatArea(85), "85 m²");
});
