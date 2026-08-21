"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { guardedAction } from "@/lib/actions/guard";
import { userRepo } from "@sitre/db/repos/user";

const ROLE = z.enum(["OWNER", "ADMIN", "EDITOR", "SALES", "VIEWER"]);

const setRoleSchema = z.object({
  id: z.string().min(1),
  role: ROLE,
});

const setDisabledSchema = z.object({
  id: z.string().min(1),
  disabled: z.enum(["true", "false"]).transform((v) => v === "true"),
});

export const updateUserRole = guardedAction(
  "user.update_role",
  {
    entity: "user",
    action: "role_change",
    resolveEntityId: (fd) => (fd.get("id") as string | null) ?? null,
    resolveDiff: (fd) => ({ role: fd.get("role") }),
  },
  async (ctx, formData) => {
    const parsed = setRoleSchema.safeParse({
      id: formData.get("id"),
      role: formData.get("role"),
    });
    if (!parsed.success) return { ok: false, error: "invalid_input" };
    if (parsed.data.id === ctx.session.user.id) {
      return { ok: false, error: "cannot_modify_self" };
    }
    await userRepo.setRole(parsed.data.id, parsed.data.role);
    revalidatePath("/admin/users");
    return { ok: true };
  }
);

export const setUserDisabled = guardedAction(
  "user.invite",
  {
    entity: "user",
    action: "disable_toggle",
    resolveEntityId: (fd) => (fd.get("id") as string | null) ?? null,
    resolveDiff: (fd) => ({ disabled: fd.get("disabled") }),
  },
  async (ctx, formData) => {
    const parsed = setDisabledSchema.safeParse({
      id: formData.get("id"),
      disabled: formData.get("disabled"),
    });
    if (!parsed.success) return { ok: false, error: "invalid_input" };
    if (parsed.data.id === ctx.session.user.id) {
      return { ok: false, error: "cannot_modify_self" };
    }
    await userRepo.setDisabled(parsed.data.id, parsed.data.disabled);
    revalidatePath("/admin/users");
    return { ok: true };
  }
);
