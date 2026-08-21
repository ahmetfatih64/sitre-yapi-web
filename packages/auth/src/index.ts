export {
  can,
  assertCan,
  ForbiddenError,
  ROLE_PERMISSIONS,
  type Role,
  type Permission,
} from "./rbac";

export {
  canEditLead,
  canTransitionProject,
  assertCanTransitionProject,
  type Actor,
  type LeadResource,
  type ProjectResource,
} from "./policy";
