"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { guardedAction } from "@/lib/actions/guard";
import { projectRepo, type PublishState } from "@sitre/db/repos/project";
import { canTransitionProject } from "@sitre/auth";

const slugSchema = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/, "slug_invalid");

const createSchema = z.object({
  slug: slugSchema,
  name: z.string().min(2).max(160),
  shortSummary: z.string().min(10).max(300),
  description: z.string().min(10),
  locationLabel: z.string().min(2).max(120),
});

const updateSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  name: z.string().min(2).max(160),
  shortSummary: z.string().min(10).max(300),
  description: z.string().min(10),
  locationLabel: z.string().min(2).max(120),
  metaTitle: z.string().max(70).optional().default(""),
  metaDescription: z.string().max(160).optional().default(""),
  coverImageUrl: z.string().url().or(z.literal("")).optional().default(""),
});

const transitionSchema = z.object({
  id: z.string().min(1),
  to: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]),
});

export const createProject = guardedAction(
  "project.draft",
  { entity: "project", action: "create" },
  async (ctx, formData) => {
    const parsed = createSchema.safeParse({
      slug: formData.get("slug"),
      name: formData.get("name"),
      shortSummary: formData.get("shortSummary"),
      description: formData.get("description"),
      locationLabel: formData.get("locationLabel"),
    });
    if (!parsed.success) return { ok: false, error: "invalid_input" };
    const { id } = await projectRepo.createDraft({
      ...parsed.data,
      authorId: ctx.session.user.id,
    });
    revalidatePath("/admin/projects");
    return { ok: true, data: { id } };
  }
);

export const updateProject = guardedAction(
  "project.draft",
  {
    entity: "project",
    action: "update",
    resolveEntityId: (fd) => (fd.get("id") as string | null) ?? null,
  },
  async (ctx, formData) => {
    const parsed = updateSchema.safeParse({
      id: formData.get("id"),
      slug: formData.get("slug"),
      name: formData.get("name"),
      shortSummary: formData.get("shortSummary"),
      description: formData.get("description"),
      locationLabel: formData.get("locationLabel"),
      metaTitle: formData.get("metaTitle") ?? "",
      metaDescription: formData.get("metaDescription") ?? "",
      coverImageUrl: formData.get("coverImageUrl") ?? "",
    });
    if (!parsed.success) return { ok: false, error: "invalid_input" };
    const { id, ...patch } = parsed.data;
    await projectRepo.updateDraft(
      id,
      {
        slug: patch.slug,
        name: patch.name,
        shortSummary: patch.shortSummary,
        description: patch.description,
        locationLabel: patch.locationLabel,
        metaTitle: patch.metaTitle || null,
        metaDescription: patch.metaDescription || null,
        coverImageUrl: patch.coverImageUrl || null,
      },
      ctx.session.user.id
    );
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    return { ok: true };
  }
);

export const transitionProject = guardedAction(
  "project.draft",
  {
    entity: "project",
    action: "transition",
    resolveEntityId: (fd) => (fd.get("id") as string | null) ?? null,
    resolveDiff: (fd) => ({ to: fd.get("to") }),
  },
  async (ctx, formData) => {
    const parsed = transitionSchema.safeParse({
      id: formData.get("id"),
      to: formData.get("to"),
    });
    if (!parsed.success) return { ok: false, error: "invalid_input" };
    const current = await projectRepo.getDraft(parsed.data.id);
    if (!current) return { ok: false, error: "not_found" };

    const allowed = canTransitionProject(
      { id: ctx.session.user.id, role: ctx.session.user.role },
      { publishState: current.publishState as PublishState },
      parsed.data.to
    );
    if (!allowed) return { ok: false, error: "forbidden_transition" };

    await projectRepo.transition(
      parsed.data.id,
      parsed.data.to,
      ctx.session.user.id
    );
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${parsed.data.id}`);
    revalidatePath("/projeler");
    revalidatePath(`/projeler/${current.slug}`);
    return { ok: true };
  }
);

export async function createProjectAndRedirect(formData: FormData): Promise<void> {
  const result = await createProject(formData);
  if (result.ok && result.data && "id" in result.data) {
    redirect(`/admin/projects/${(result.data as { id: string }).id}`);
  }
}
