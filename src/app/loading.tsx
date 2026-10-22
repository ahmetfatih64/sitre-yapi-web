/**
 * Rota geçişlerinde gösterilen iskelet. Gerçek içeriğin ritmini taklit eder
 * ki yükleme bitince sayfa yerinden oynamasın.
 */
export default function Loading() {
  return (
    <div className="section pt-40" aria-busy="true" aria-live="polite">
      <div className="container-page">
        <span className="sr-only">Sayfa yükleniyor…</span>
        <div className="skeleton skeleton--eyebrow" />
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--short" />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="skeleton skeleton--card" />
          <div className="skeleton skeleton--card" />
          <div className="skeleton skeleton--card" />
        </div>
      </div>
    </div>
  );
}
