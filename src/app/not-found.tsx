import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section pt-40 min-h-[80vh] flex items-center">
      <div className="container-page text-center max-w-2xl mx-auto">
        <p className="eyebrow">404</p>
        <h1 className="display-xl mt-6">Aradığınız sayfa burada değil.</h1>
        <p className="lede mt-6 mx-auto">
          Belki ana sayfadan devam etmek istersiniz.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-primary">
            Ana sayfaya dön
          </Link>
          <Link href="/projeler" className="btn btn-outline">
            Projeleri gör
          </Link>
        </div>
      </div>
    </section>
  );
}
