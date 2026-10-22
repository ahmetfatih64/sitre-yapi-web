"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/content/site.config";

type ContactMode = "phone" | "whatsapp";

interface ContactMenuProps {
  mode: ContactMode;
  variant?: "header" | "floating";
  className?: string;
  /** Şeffaf header koyu hero üstündeyken açık renk kenarlık kullan. */
  onDark?: boolean;
  /**
   * WhatsApp mesajına önceden yazılacak bağlam. Türkiye'de form doldurmaktan
   * çok daha yüksek dönüşüm veren yol; karşı taraf neyle ilgilendiğini
   * ilk mesajda görür.
   */
  contextLabel?: string;
}

const COPY: Record<ContactMode, { label: string; title: string; hint: string }> = {
  phone: {
    label: "Telefonla ara",
    title: "Bizi arayın",
    hint: "Bir numarayı seçin",
  },
  whatsapp: {
    label: "WhatsApp ile yazın",
    title: "WhatsApp'tan yazın",
    hint: "Bir numara seçin",
  },
};

/**
 * Sadece rakamlardan oluşan E.164-benzeri form, wa.me link'i için.
 * "+90 507 164 58 92" → "905071645892"
 */
function toWaDigits(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}


/** wa.me bağlantısı; bağlam verilmişse mesaj önceden doldurulur. */
function waHref(phone: string, contextLabel?: string): string {
  const base = `https://wa.me/${toWaDigits(phone)}`;
  if (!contextLabel) return base;
  const text = `Merhaba, ${contextLabel} hakkında bilgi almak istiyorum.`;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function ContactMenu({
  mode,
  variant = "header",
  className,
  onDark = false,
  contextLabel,
}: ContactMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const copy = COPY[mode];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const buttonBase =
    variant === "floating"
      ? "w-14 h-14 rounded-full shadow-lg transition-colors text-white"
      : "w-11 h-11 rounded-full border transition-colors flex items-center justify-center " +
        (onDark
          ? "border-white/45 hover:border-white"
          : "border-[var(--color-border)] hover:border-[var(--color-brand)]");

  const floatingColor =
    mode === "whatsapp"
      ? "bg-[#25D366] hover:bg-[#1ebe57]"
      : "bg-[var(--color-brand)] hover:bg-[var(--color-accent)]";

  const hoverIconColor =
    mode === "whatsapp"
      ? "hover:text-[#25D366]"
      : "hover:text-[var(--color-accent)]";

  return (
    <div
      ref={rootRef}
      className={"relative " + (className ?? "")}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={copy.label}
        aria-haspopup="menu"
        aria-expanded={open}
        className={
          buttonBase +
          " flex items-center justify-center " +
          (variant === "floating" ? floatingColor : hoverIconColor)
        }
      >
        {mode === "phone" ? <PhoneIcon /> : <WhatsAppIcon />}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={copy.title}
          className={
            "absolute z-50 mt-3 w-72 bg-white border border-[var(--color-border)] shadow-lg " +
            (variant === "floating"
              ? "right-0 bottom-full mb-3 mt-0"
              : "right-0")
          }
        >
          <div className="px-5 py-3 border-b border-[var(--color-border)]">
            <p
              className={
                "eyebrow " +
                (mode === "whatsapp"
                  ? "!text-[#25D366]"
                  : "!text-[var(--color-accent)]")
              }
            >
              {copy.title}
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              {copy.hint}
            </p>
          </div>
          <ul>
            {siteConfig.founders.map((f) => {
              const href =
                mode === "phone"
                  ? f.phoneHref
                  : waHref(f.phone, contextLabel);
              const extraProps =
                mode === "whatsapp"
                  ? { target: "_blank", rel: "noopener noreferrer" as const }
                  : {};
              return (
                <li key={f.phoneHref}>
                  <a
                    role="menuitem"
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--color-bg-alt)] border-b last:border-b-0 border-[var(--color-border)] transition-colors"
                    {...extraProps}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[var(--color-brand)]">
                        {f.name}
                      </span>
                      <span className="text-xs text-[var(--color-brand-soft)] tabular-nums mt-0.5">
                        {f.phone}
                      </span>
                    </div>
                    <span
                      className={
                        mode === "whatsapp"
                          ? "text-[#25D366]"
                          : "text-[var(--color-accent)]"
                      }
                      aria-hidden="true"
                    >
                      {mode === "phone" ? (
                        <PhoneIcon size={18} />
                      ) : (
                        <WhatsAppIcon size={18} />
                      )}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function PhoneIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.669.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.695.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
