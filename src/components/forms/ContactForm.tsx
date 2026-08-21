"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues } from "@/lib/forms/schema";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  defaultProject?: string;
  onSuccess?: () => void;
};

export function ContactForm({ compact = false, defaultProject, onSuccess }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      projectInterest: defaultProject ?? "",
      consent: undefined as unknown as true,
      website: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("loading");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Bilinmeyen hata");
      }
      setStatus("success");
      reset();
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setServerError(
        "İsteğiniz şu anda iletilemiyor. Kısa süre sonra tekrar denemenizi rica ederiz."
      );
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-8 border border-[var(--color-border)] bg-[var(--color-bg-alt)]"
      >
        <p className="eyebrow mb-3">Teşekkür ederiz</p>
        <p className="display-md">En kısa sürede size ulaşacağız.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn btn-ghost mt-6 underline"
        >
          Yeni bir mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn(
        "grid gap-5",
        compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
      )}
    >
      <Field label="Ad Soyad" error={errors.name?.message}>
        <input
          {...register("name")}
          autoComplete="name"
          className="field-input"
          aria-invalid={!!errors.name}
        />
      </Field>
      <Field label="Telefon" error={errors.phone?.message}>
        <input
          {...register("phone")}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="field-input"
          aria-invalid={!!errors.phone}
        />
      </Field>
      <Field label="E-posta" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          className="field-input"
          aria-invalid={!!errors.email}
        />
      </Field>
      <Field label="İlgilendiğiniz proje" error={errors.projectInterest?.message}>
        <select
          {...register("projectInterest")}
          className="field-input"
          defaultValue={defaultProject ?? ""}
        >
          <option value="">Belirtmedim</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field
        label="Mesajınız (opsiyonel)"
        error={errors.message?.message}
        className={compact ? undefined : "md:col-span-2"}
      >
        <textarea
          {...register("message")}
          rows={4}
          className="field-input resize-y min-h-[120px]"
          aria-invalid={!!errors.message}
        />
      </Field>

      {/* honeypot */}
      <div className="hidden" aria-hidden>
        <label>
          Web adresi
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className={compact ? undefined : "md:col-span-2"}>
        <label className="flex items-start gap-3 text-sm text-[var(--color-brand-soft)] cursor-pointer">
          <input
            type="checkbox"
            {...register("consent")}
            className="mt-[3px] w-4 h-4 accent-[var(--color-brand)]"
            aria-invalid={!!errors.consent}
          />
          <span>
            <a href="/kvkk" target="_blank" className="underline">
              KVKK Aydınlatma Metni
            </a>
            'ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
          </span>
        </label>
        {errors.consent?.message && (
          <p className="mt-2 text-sm text-[var(--color-error)]">
            {errors.consent.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          role="alert"
          className={cn(
            "text-sm text-[var(--color-error)]",
            !compact && "md:col-span-2"
          )}
        >
          {serverError}
        </p>
      )}

      <div className={compact ? undefined : "md:col-span-2"}>
        <button
          type="submit"
          className="btn btn-primary w-full md:w-auto"
          disabled={status === "loading"}
          aria-busy={status === "loading"}
        >
          {status === "loading" ? "Gönderiliyor…" : "Gönder"}
        </button>
      </div>

    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-xs uppercase tracking-[0.14em] text-[var(--color-brand-soft)] mb-2">
        {label}
      </span>
      {children}
      {error && (
        <span className="block mt-2 text-sm text-[var(--color-error)]">
          {error}
        </span>
      )}
    </label>
  );
}
