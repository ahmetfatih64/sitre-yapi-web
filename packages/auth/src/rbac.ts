/**
 * Role-Based Access Control matrix. Single source of truth — admin UI and
 * API route guards both consume `can()`. New permissions go in `Permission`,
 * new role rules go in `ROLE_PERMISSIONS`.
 */
export type Role = "OWNER" | "ADMIN" | "EDITOR" | "SALES" | "VIEWER";

export type Permission =
  | "project.read"
  | "project.draft"
  | "project.review"
  | "project.publish"
  | "project.archive"
  | "media.upload"
  | "media.delete"
  | "lead.read"
  | "lead.assign"
  | "lead.update"
  | "lead.export"
  | "user.read"
  | "user.invite"
  | "user.update_role"
  | "audit.read"
  | "settings.update";

const VIEWER: Permission[] = ["project.read", "lead.read"];
const SALES: Permission[] = [...VIEWER, "lead.assign", "lead.update", "lead.export"];
const EDITOR: Permission[] = [
  ...VIEWER,
  "project.draft",
  "project.review",
  "media.upload",
];
const ADMIN: Permission[] = [
  ...EDITOR,
  ...SALES,
  "project.publish",
  "project.archive",
  "media.delete",
  "user.read",
  "user.invite",
  "audit.read",
];
const OWNER: Permission[] = [...ADMIN, "user.update_role", "settings.update"];

export const ROLE_PERMISSIONS: Record<Role, ReadonlyArray<Permission>> = {
  VIEWER,
  SALES,
  EDITOR,
  ADMIN,
  OWNER,
};

export function can(role: Role | undefined | null, perm: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(perm);
}

export function assertCan(role: Role | undefined | null, perm: Permission): void {
  if (!can(role, perm)) {
    throw new ForbiddenError(`role=${role ?? "anonymous"} lacks permission=${perm}`);
  }
}

export class ForbiddenError extends Error {
  readonly code = "FORBIDDEN" as const;
}
