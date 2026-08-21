"use client";

import { useState, useTransition } from "react";
import type { ProjectDraft } from "@sitre/db/repos/project";
import { updateProject, transitionProject } from "../actions";

type Transition = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";

const NEXT_STATES: Record<string, Transition[]> = {
  DRAFT: ["IN_REVIEW", "ARCHIVED"],
  IN_REVIEW: ["DRAFT", "PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["DRAFT", "ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};

const LABEL: Record<Transition, string> = {
  DRAFT: "Taslağa al",
  IN_REVIEW: "İncelemeye gönder",
  PUBLISHED: "Yayına al",
  ARCHIVED: "Arşivle",
};

export function ProjectEditor({ draft }: { draft: ProjectDraft }) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string>("");

  async function onSubmit(fd: FormData) {
    setMessage("");
    start(async () => {
      const result = await updateProject(fd);
      setMessage(result.ok ? "Kaydedildi." : `Hata: ${result.error}`);
    });
  }

  function doTransition(to: Transition) {
    const fd = new FormData();
    fd.set("id", draft.id);
    fd.set("to", to);
    start(async () => {
      const result = await transitionProject(fd);
      setMessage(result.ok ? `Durum: ${to}` : `Hata: ${result.error}`);
    });
  }

  const next = NEXT_STATES[draft.publishState] ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-[var(--color-brand-soft)]">Durum:</span>
        <span className="font-mono">{draft.publishState}</span>
        {next.map((to) => (
          <button
            key={to}
            type="button"
            disabled={pending}
            onClick={() => doTransition(to)}
            className="border border-[var(--color-border)] rounded px-3 py-1"
          >
            {LABEL[to]}
          </button>
        ))}
      </div>

      <form
        action={onSubmit}
        className="bg-white border border-[var(--color-border)] rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input type="hidden" name="id" value={draft.id} />
        <Field label="Ad" name="name" defaultValue={draft.name} required />
        <Field
          label="Slug"
          name="slug"
          defaultValue={draft.slug}
          required
          pattern="^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$"
        />
        <Field
          label="Konum etiketi"
          name="locationLabel"
          defaultValue={draft.locationLabel}
          required
        />
        <Field
          label="Kapak görseli URL"
          name="coverImageUrl"
          defaultValue={draft.coverImageUrl ?? ""}
        />
        <Field
          label="Meta başlık"
          name="metaTitle"
          defaultValue={draft.metaTitle ?? ""}
        />
        <Field
          label="Meta açıklama"
          name="metaDescription"
          defaultValue={draft.metaDescription ?? ""}
        />
        <Field
          label="Kısa özet"
          name="shortSummary"
          defaultValue={draft.shortSummary}
          required
          as="textarea"
          rows={2}
          span
        />
        <Field
          label="Açıklama"
          name="description"
          defaultValue={draft.description}
          required
          as="textarea"
          rows={8}
          span
        />
        <div className="md:col-span-2 flex items-center justify-between">
          <span className="text-xs text-[var(--color-brand-soft)]">
            {message}
          </span>
          <button
            type="submit"
            disabled={pending}
            className="bg-[var(--color-brand,#0a0a0a)] text-white rounded px-4 py-2 text-sm"
          >
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  pattern,
  as,
  rows,
  span,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  pattern?: string;
  as?: "textarea";
  rows?: number;
  span?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${span ? "md:col-span-2" : ""}`}>
      <span className="font-medium">{label}</span>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          defaultValue={defaultValue}
          className="border border-[var(--color-border)] rounded px-3 py-2 bg-white"
        />
      ) : (
        <input
          name={name}
          required={required}
          pattern={pattern}
          defaultValue={defaultValue}
          className="border border-[var(--color-border)] rounded px-3 py-2 bg-white"
        />
      )}
    </label>
  );
}
