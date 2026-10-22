"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Rota düzeyinde hata sınırı. Layout (header/footer) ayakta kalır, yalnızca
 * içerik bu ekranla değişir. `reset()` aynı rotayı yeniden dener.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sunucu tarafı zaten logluyor; burada istemci bağlamını da kaydediyoruz.
    console.error("[route-error]", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="section pt-40 min-h-[70vh] flex items-center">
      <div className="container-page text-center max-w-2xl mx-auto">
        <p className="eyebrow">Bir aksaklık oldu</p>
        <h1 className="display-lg mt-6">Bu sayfa şu an açılamadı.</h1>
        <p className="lede mt-6 mx-auto">
          Geçici bir sorun olabilir. Tekrar denemek ya da ana sayfadan devam
          etmek isteyebilirsiniz.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={reset} className="btn btn-primary">
            Tekrar dene
          </button>
          <Link href="/" className="btn btn-outline">
            Ana sayfaya dön
          </Link>
        </div>

        {error.digest ? (
          <p className="mt-10 text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">
            Hata kodu: {error.digest}
          </p>
        ) : null}
      </div>
    </section>
  );
}
