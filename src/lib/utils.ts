import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatArea(m2: number): string {
  return `${m2.toLocaleString("tr-TR")} m²`;
}

/**
 * Kart künyesinde gösterilecek teslim ibaresi.
 * İçerikte değer bazen "2027 Q4", bazen "Teslim edildi (2024)" biçiminde
 * girildiği için önek koşullu eklenir; aksi halde kelime tekrarlanır.
 */
export function deliveryLabel(value: string | undefined): string | undefined {
  if (!value) return undefined;
  // Türkçe büyük "İ" (U+0130) JavaScript regex'inin /i bayrağıyla "i"ye
  // katlanmaz; varsayılan toLowerCase() de birleşen noktalı "i̇" üretir.
  // Bu yüzden karşılaştırma Türkçe yerel ayarıyla yapılıyor.
  const normalized = value.toLocaleLowerCase("tr");
  return normalized.includes("teslim") ? value : `Teslim ${value}`;
}
