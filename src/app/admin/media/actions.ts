"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { guardedAction } from "@/lib/actions/guard";
import { mediaRepo } from "@sitre/db/repos/media";
import { getStorage } from "@/lib/storage/factory";

const MAX_BYTES = 50 * 1024 * 1024;
const MIME_WHITELIST = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "application/pdf",
]);

const attachSchema = z.object({
  storageKey: z.string().min(1).max(500),
  url: z.string().url(),
  mimeType: z.string().refine((v) => MIME_WHITELIST.has(v), "mime_not_allowed"),
  byteSize: z.coerce.number().int().positive().max(MAX_BYTES),
  projectId: z.string().nullable().optional(),
  alt: z.string().max(300).optional(),
  caption: z.string().max(500).optional(),
});

export const attachMedia = guardedAction(
  "media.upload",
  {
    entity: "media",
    action: "attach",
    resolveEntityId: (fd) => (fd.get("storageKey") as string | null) ?? null,
  },
  async (ctx, formData) => {
    const parsed = attachSchema.safeParse({
      storageKey: formData.get("storageKey"),
      url: formData.get("url"),
      mimeType: formData.get("mimeType"),
      byteSize: formData.get("byteSize"),
      projectId: formData.get("projectId") || null,
      alt: formData.get("alt") ?? undefined,
      caption: formData.get("caption") ?? undefined,
    });
    if (!parsed.success) return { ok: false, error: "invalid_input" };

    const { id } = await mediaRepo.attach({
      storageKey: parsed.data.storageKey,
      url: parsed.data.url,
      mimeType: parsed.data.mimeType,
      byteSize: parsed.data.byteSize,
      projectId: parsed.data.projectId ?? null,
      uploadedById: ctx.session.user.id,
      alt: parsed.data.alt ?? null,
      caption: parsed.data.caption ?? null,
    });

    revalidatePath("/admin/media");
    if (parsed.data.projectId) {
      revalidatePath(`/admin/projects/${parsed.data.projectId}`);
    }
    return { ok: true, data: { id } };
  }
);

export const linkMediaToProject = guardedAction(
  "media.upload",
  {
    entity: "media",
    action: "link",
    resolveEntityId: (fd) => (fd.get("id") as string | null) ?? null,
    resolveDiff: (fd) => ({ projectId: fd.get("projectId") }),
  },
  async (_ctx, formData) => {
    const id = formData.get("id");
    const projectId = formData.get("projectId");
    if (typeof id !== "string" || !id) return { ok: false, error: "invalid_input" };
    await mediaRepo.setProject(
      id,
      typeof projectId === "string" && projectId ? projectId : null
    );
    revalidatePath("/admin/media");
    if (typeof projectId === "string" && projectId) {
      revalidatePath(`/admin/projects/${projectId}`);
    }
    return { ok: true };
  }
);

export const deleteMedia = guardedAction(
  "media.delete",
  {
    entity: "media",
    action: "delete",
    resolveEntityId: (fd) => (fd.get("id") as string | null) ?? null,
  },
  async (_ctx, formData) => {
    const id = formData.get("id");
    if (typeof id !== "string" || !id) return { ok: false, error: "invalid_input" };
    const row = await mediaRepo.delete(id);
    if (row?.storageKey) {
      try {
        await getStorage().delete(row.storageKey);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "unknown";
        console.warn("[media.delete] storage delete failed:", message);
      }
    }
    revalidatePath("/admin/media");
    return { ok: true };
  }
);
