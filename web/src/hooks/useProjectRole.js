import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../features/auth/authSlice.js";
import { useGetMembersQuery } from "../services/endpoints/members.api.js";
import { PROJECT_ROLE } from "../lib/constants.js";

/**
 * Derives the caller's role in a project from its member list — the API
 * exposes no dedicated "my role" endpoint. Used to hide Admin-only controls;
 * the server still enforces the real check on every request.
 */
export function useProjectRole(projectId) {
  const userId = useSelector(selectCurrentUserId);
  const { data: members, isLoading } = useGetMembersQuery(projectId, {
    skip: !projectId,
  });

  const membership = members?.find((member) => member.id === userId);

  return {
    role: membership?.role ?? null,
    isAdmin: membership?.role === PROJECT_ROLE.ADMIN,
    isMember: Boolean(membership),
    members: members ?? [],
    isLoading,
  };
}
