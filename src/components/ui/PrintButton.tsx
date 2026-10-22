"use client";

/**
 * Sayfayı yazdırma / PDF'e kaydetme eylemini başlatır.
 *
 * Katalog sunucuda PDF olarak üretilmez: sayfanın kendisi baskı için
 * biçimlendirilir (bkz. globals.css `@media print`). Üretilen kat planları
 * SVG olduğu için kağıtta ve PDF'te vektörel, yani net çıkar.
 */
export function PrintButton({
  children = "Kataloğu indir",
  className = "btn btn-outline",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {children}
    </button>
  );
}
