import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { can } from "@sitre/auth";
import { createProjectAndRedirect } from "../actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!can(session.user.role, "project.draft")) redirect("/admin/projects");

  return (
    <section className="flex flex-col gap-6 max-w-2xl">
      <header>
        <p className="eyebrow mb-2">Yeni</p>
        <h1 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          Yeni proje taslağı
        </h1>
      </header>

      <form
        action={createProjectAndRedirect}
        className="bg-white border border-[var(--color-border)] rounded-xl p-6 flex flex-col gap-4"
      >
        <Field label="Ad" name="name" required />
        <Field
          label="Slug"
          name="slug"
          required
          hint="Küçük harf, rakam ve tire. Örn: cankaya-life"
          pattern="^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$"
        />
        <Field label="Konum etiketi" name="locationLabel" required />
        <Field
          label="Kısa özet"
          name="shortSummary"
          required
          as="textarea"
          rows={2}
          hint="10–300 karakter. Kartlarda ve SERP'de görünür."
        />
        <Field
          label="Açıklama"
          name="description"
          required
          as="textarea"
          rows={6}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[var(--color-brand,#0a0a0a)] text-white rounded px-4 py-2 text-sm"
          >
            Taslağı oluştur
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  required,
  hint,
  pattern,
  as,
  rows,
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  pattern?: string;
  as?: "textarea";
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          className="border border-[var(--color-border)] rounded px-3 py-2 bg-white"
        />
      ) : (
        <input
          name={name}
          required={required}
          pattern={pattern}
          className="border border-[var(--color-border)] rounded px-3 py-2 bg-white"
        />
      )}
      {hint && <span className="text-xs text-[var(--color-brand-soft)]">{hint}</span>}
    </label>
  );
}
