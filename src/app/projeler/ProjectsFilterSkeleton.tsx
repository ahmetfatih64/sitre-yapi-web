/**
 * `ProjectsFilter` için Suspense yedeği.
 *
 * `useSearchParams` Suspense sınırı zorunlu kılar. Yedek boş bırakılırsa
 * alttaki CTA bandı sayfanın yukarısında render edilir ve asıl içerik
 * gelince ~1800px aşağı sıçrar; ölçümde CLS 0.335 çıkıyordu (hedef 0.05).
 *
 * Bu yüzden yedek, gerçek düzenin yerini ayırır: aynı süzgeç çubuğu
 * yüksekliği ve aynı sayıda, aynı en-boy oranında kart.
 */
export function ProjectsFilterSkeleton({ count }: { count: number }) {
  return (
    <section className="pb-32" aria-hidden="true">
      <div className="container-page">
        <div className="mb-12 border-b border-[var(--color-border)] pb-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 44, width: 110 }} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="skeleton" style={{ height: 36, width: 90 }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 36, width: 96 }} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: count }).map((_, i) => (
            // Kart medyası .slide-card__media ile aynı oranda; yükseklik birebir ayrılır.
            <div key={i} className="skeleton" style={{ aspectRatio: "4 / 5" }} />
          ))}
        </div>
      </div>
    </section>
  );
}
