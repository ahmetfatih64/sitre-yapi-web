"use client";

import Link from "next/link";
import { useState } from "react";
import { useConsent } from "@/lib/consent/provider";

export function CookieBar() {
  const consent = useConsent();
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Show the bar until a decision is recorded.
  const showBar = !consent.decided && !consent.prefsOpen;

  return (
    <>
      {showBar && (
        <div
          role="region"
          aria-label="Çerez bilgilendirmesi"
          className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[var(--color-border)] shadow-[var(--shadow-lg)]"
        >
          <div className="container-page py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <p className="text-sm text-[var(--color-brand-soft)] flex-1">
              Bu site; zorunlu çerezlere ek olarak, izninizle analitik ve
              pazarlama çerezleri kullanır.{" "}
              <Link href="/cerez-politikasi" className="underline">
                Çerez politikası
              </Link>{" "}
              ·{" "}
              <Link href="/kvkk" className="underline">
                KVKK
              </Link>
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={consent.rejectAll}
                className="btn btn-outline"
              >
                Reddet
              </button>
              <button
                type="button"
                onClick={consent.reopen}
                className="btn btn-outline"
              >
                Özelleştir
              </button>
              <button
                type="button"
                onClick={consent.acceptAll}
                className="btn btn-primary"
              >
                Tümünü kabul et
              </button>
            </div>
          </div>
        </div>
      )}

      {consent.prefsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-prefs-title"
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
            <h2
              id="consent-prefs-title"
              className="text-xl mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Çerez tercihleri
            </h2>
            <p className="text-sm text-[var(--color-brand-soft)] mb-5">
              Zorunlu çerezler dışındaki kategorileri tercihinize göre
              açıp kapatabilirsiniz. İstediğiniz zaman bu paneli tekrar
              açabilirsiniz.
            </p>

            <ul className="flex flex-col gap-3 mb-6">
              <li className="flex items-start justify-between gap-4 p-3 rounded-lg border border-[var(--color-border)]">
                <div>
                  <p className="font-medium">Zorunlu</p>
                  <p className="text-xs text-[var(--color-brand-soft)]">
                    Site güvenliği ve çekirdek işlevsellik için gereklidir.
                    Kapatılamaz.
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wider text-[var(--color-brand-soft)]">
                  Aktif
                </span>
              </li>

              <li className="flex items-start justify-between gap-4 p-3 rounded-lg border border-[var(--color-border)]">
                <div>
                  <p className="font-medium">Analitik</p>
                  <p className="text-xs text-[var(--color-brand-soft)]">
                    Ziyaretçi davranışını anonim ölçerek siteyi iyileştirmek
                    için kullanılır.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                </label>
              </li>

              <li className="flex items-start justify-between gap-4 p-3 rounded-lg border border-[var(--color-border)]">
                <div>
                  <p className="font-medium">Pazarlama</p>
                  <p className="text-xs text-[var(--color-brand-soft)]">
                    Kampanya performansı ve hedefli iletişim için kullanılır.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                  />
                </label>
              </li>
            </ul>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={consent.rejectAll}
                className="btn btn-outline"
              >
                Tümünü reddet
              </button>
              <button
                type="button"
                onClick={() => consent.customize(analytics, marketing)}
                className="btn btn-outline"
              >
                Seçimi kaydet
              </button>
              <button
                type="button"
                onClick={consent.acceptAll}
                className="btn btn-primary"
              >
                Tümünü kabul et
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
