"use client";

import { useEffect, useRef } from "react";
import { useQuickContact } from "./QuickContactProvider";
import { ContactForm } from "./ContactForm";

export function QuickContactModal() {
  const { isOpen, close, projectHint, planHint, ctaContext } = useQuickContact();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("input,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Size ulaşalım"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
    >
      <button
        type="button"
        aria-label="Kapat"
        onClick={close}
        className="absolute inset-0 bg-[rgba(20,16,13,0.55)] backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        className="relative w-full md:max-w-xl bg-white shadow-[var(--shadow-xl)] max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between p-6 md:p-8 border-b border-[var(--color-border)]">
          <div>
            <p className="eyebrow mb-2">İletişim</p>
            <h2
              className="text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Size ulaşalım
            </h2>
            <p className="text-sm text-[var(--color-brand-soft)] mt-2">
              Formu iletin, kısa sürede geri dönelim.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Modalı kapat"
            className="w-11 h-11 flex items-center justify-center text-2xl leading-none hover:text-[var(--color-accent)]"
          >
            ×
          </button>
        </div>
        <div className="p-6 md:p-8">
          <ContactForm
            compact
            {...(projectHint ? { defaultProject: projectHint } : {})}
            {...(planHint ? { planId: planHint } : {})}
            ctaContext={ctaContext ?? "modal"}
            onSuccess={() => setTimeout(close, 2000)}
          />
        </div>
      </div>
    </div>
  );
}
