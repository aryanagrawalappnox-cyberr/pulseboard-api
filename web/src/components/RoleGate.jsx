import { useProjectRole } from "../hooks/useProjectRole.js";
import { PROJECT_ROLE } from "../lib/constants.js";

/**
 * Hides children unless the caller holds one of `allow` in this project.
 * Presentation only — the API enforces the same rules and returns 403, which
 * the dev panel surfaces when you want to test that path.
 */
export function RoleGate({ projectId, allow = [PROJECT_ROLE.ADMIN], children, fallback = null }) {
  const { role } = useProjectRole(projectId);

  if (!role || !allow.includes(role)) return fallback;

  return children;
}
