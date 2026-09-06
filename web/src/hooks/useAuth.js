import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentUserId,
  selectIsAuthenticated,
  selectToken,
  userLoaded,
} from "../features/auth/authSlice.js";
import { useGetUserQuery } from "../services/endpoints/users.api.js";

/**
 * Loads the signed-in user's profile. The API has no /auth/me, so the id comes
 * from the JWT payload and the profile from GET /users/:userId, which
 * userOwnershipMiddleware permits for the caller's own id.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userId = useSelector(selectCurrentUserId);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data, isLoading } = useGetUserQuery(userId, { skip: !userId });

  useEffect(() => {
    if (data && data.id !== user?.id) {
      dispatch(userLoaded(data));
    }
  }, [data, user?.id, dispatch]);

  return {
    token,
    userId,
    user: user ?? data ?? null,
    isAuthenticated,
    isLoadingUser: isLoading,
  };
}
