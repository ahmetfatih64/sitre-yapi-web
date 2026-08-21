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
      className={variant === "dark" ? "section text-white" : "section bg-[var(--color-bg-alt)]"}
      style={variant === "dark" ? { background: "#2b2a28" } : undefined}
    >
      <div className="container-page">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            {overline && (
              <p className="eyebrow mb-5 !text-[var(--color-accent-soft)]">
                {overline}
              </p>
            )}
            <h2 className="display-lg max-w-2xl">{title}</h2>
            {description && (
              <p
                className={
                  "lede mt-6 " +
                  (variant === "dark" ? "text-[#cdc7bd]" : "")
                }
              >
                {description}
              </p>
            )}
          </div>
          <div className="md:col-span-4 flex flex-wrap gap-4 md:justify-end">
            <button
              type="button"
              onClick={() => open()}
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
