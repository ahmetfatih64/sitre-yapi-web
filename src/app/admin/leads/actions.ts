"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { guardedAction } from "@/lib/actions/guard";
import { leadRepo, type LeadListItem } from "@sitre/db/repos/lead";

const STATUS = z.enum(["NEW", "CONTACTED", "QUALIFIED", "LOST", "WON"]);

const setStatusSchema = z.object({
  id: z.string().min(1),
  status: STATUS,
});

const assignSchema = z.object({
  id: z.string().min(1),
  assigneeId: z.string().min(1).nullable(),
});

export const updateLeadStatus = guardedAction(
  "lead.update",
  {
    entity: "lead",
    action: "status_change",
    resolveEntityId: (fd) => (fd.get("id") as string | null) ?? null,
    resolveDiff: (fd) => ({ status: fd.get("status") }),
  },
  async (_ctx, formData) => {
    const parsed = setStatusSchema.safeParse({
      id: formData.get("id"),
      status: formData.get("status"),
    });
    if (!parsed.success) return { ok: false, error: "invalid_input" };
    await leadRepo.setStatus(
      parsed.data.id,
      parsed.data.status as LeadListItem["status"]
    );
    revalidatePath("/admin/leads");
    return { ok: true };
  }
);

export const assignLead = guardedAction(
  "lead.assign",
  {
    entity: "lead",
    action: "assign",
    resolveEntityId: (fd) => (fd.get("id") as string | null) ?? null,
    resolveDiff: (fd) => ({ assigneeId: fd.get("assigneeId") }),
  },
  async (_ctx, formData) => {
    const raw = formData.get("assigneeId");
    const parsed = assignSchema.safeParse({
      id: formData.get("id"),
      assigneeId: raw === "" || raw === null ? null : String(raw),
    });
    if (!parsed.success) return { ok: false, error: "invalid_input" };
    await leadRepo.assign(parsed.data.id, parsed.data.assigneeId);
    revalidatePath("/admin/leads");
    return { ok: true };
  }
);
