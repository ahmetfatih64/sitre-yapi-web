/**
 * Server action helper. Wraps a mutating action with: session lookup,
 * RBAC permission check, audit log emission, and uniform error shaping.
 *
 * Usage:
 *   export const updateLeadStatus = guardedAction(
 *     "lead.update",
 *     { entity: "lead", action: "status_change" },
 *     async ({ session }, formData) => { ... }
 *   );
 */
import { headers } from "next/headers";
import { getSession, type AuthSession } from "@/lib/auth/session";
import { can, type Permission } from "@sitre/auth";
import { env } from "@/lib/env";
import { auditRepo } from "@sitre/db/repos/audit";

export type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export interface AuditMeta {
  entity: string;
  action: string;
  resolveEntityId?: (formData: FormData) => string | null;
  resolveDiff?: (formData: FormData) => unknown;
}

export interface ActionContext {
  session: AuthSession;
  ip: string | null;
}

export function guardedAction<T = unknown>(
  perm: Permission,
  meta: AuditMeta,
  fn: (ctx: ActionContext, formData: FormData) => Promise<ActionResult<T>>
) {
  return async function action(formData: FormData): Promise<ActionResult<T>> {
    const session = await getSession();
    if (!session) return { ok: false, error: "unauthenticated" };
    if (!can(session.user.role, perm)) return { ok: false, error: "forbidden" };

    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null;

    let result: ActionResult<T>;
    try {
      result = await fn({ session, ip }, formData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "unknown";
      console.error(`[action ${meta.entity}.${meta.action}]`, message);
      return { ok: false, error: "server_error" };
    }

    if (result.ok && env.HAS_DB) {
      try {
        await auditRepo.record({
          actorId: session.user.id,
          action: meta.action,
          entity: meta.entity,
          entityId: meta.resolveEntityId?.(formData) ?? null,
          ip,
          diff: meta.resolveDiff?.(formData) ?? null,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "unknown";
        console.warn("[action audit] record failed:", message);
      }
    }

    return result;
  };
}
