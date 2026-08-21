/**
 * Attribute-based guards layered on top of RBAC. Use when a permission alone
 * isn't enough — e.g. SALES can update only their own assigned leads, EDITOR
 * can publish only projects they authored *if* they also have publish perm.
 */
import { can, assertCan, type Permission, type Role } from "./rbac";

export interface Actor {
  id: string;
  role: Role;
}

export interface LeadResource {
  assigneeId: string | null;
}

export function canEditLead(actor: Actor, lead: LeadResource): boolean {
  if (!can(actor.role, "lead.update")) return false;
  if (actor.role === "ADMIN" || actor.role === "OWNER") return true;
  return lead.assigneeId === actor.id;
}

export interface ProjectResource {
  publishState: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
}

export function canTransitionProject(
  actor: Actor,
  project: ProjectResource,
  to: ProjectResource["publishState"]
): boolean {
  const map: Record<ProjectResource["publishState"], Permission> = {
    DRAFT: "project.draft",
    IN_REVIEW: "project.review",
    PUBLISHED: "project.publish",
    ARCHIVED: "project.archive",
  };
  return can(actor.role, map[to]);
}

export function assertCanTransitionProject(
  actor: Actor,
  project: ProjectResource,
  to: ProjectResource["publishState"]
): void {
  if (!canTransitionProject(actor, project, to)) {
    assertCan(actor.role, "project.publish"); // throws ForbiddenError with diagnostic
  }
}
