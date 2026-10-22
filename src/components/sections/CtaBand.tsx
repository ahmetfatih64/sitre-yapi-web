"use client";

import Link from "next/link";
import { useQuickContact } from "@/components/forms/QuickContactProvider";

type Props = {
  overline?: string;
  title: string;
  description?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: "light" | "dark";
};

export function CtaBand({
  overline,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  secondaryHref,
  variant = "dark",
}: Props) {
  const { open } = useQuickContact();
  return (
    <section
      data-print="hide"
      className={
        variant === "dark"
          ? "cta-close grain text-white"
          : "section bg-[var(--color-bg-alt)]"
      }
    >
      <div className="container-page relative z-[2]">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            {overline && (
              <p className="eyebrow mb-3 !text-[var(--color-accent-soft)]">
                {overline}
              </p>
            )}
            <h2 className="cta-close__title">{title}</h2>
            {description && (
              <p
                className={
                  "cta-close__desc " +
                  (variant === "dark" ? "text-[#b6b0a8]" : "text-[var(--color-brand-soft)]")
                }
              >
                {description}
              </p>
            )}
          </div>
          <div className="md:col-span-5 flex flex-wrap gap-3 md:justify-end">
            <button
              type="button"
              onClick={() => open({ context: "kapanis-bandi" })}
              className={variant === "dark" ? "btn btn-on-dark" : "btn btn-primary"}
            >
              {primaryLabel}
            </button>
            {secondaryLabel && secondaryHref && (
              <Link
                href={secondaryHref}
                className={
                  variant === "dark"
                    ? "btn btn-outline !text-white !border-white hover:!bg-white hover:!text-[var(--color-brand)]"
                    : "btn btn-outline"
                }
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
