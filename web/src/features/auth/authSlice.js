import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEY } from "../../lib/constants.js";
import { getUserIdFromToken, isTokenExpired } from "../../lib/jwt.js";

/**
 * Rehydrates the session from localStorage. Tokens expire after 1h, so an
 * expired one is discarded on boot rather than letting the first request 401.
 */
function loadInitialState() {
  const token = localStorage.getItem(STORAGE_KEY);

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(STORAGE_KEY);
    return { token: null, userId: null, user: null };
  }

  return { token, userId: getUserIdFromToken(token), user: null };
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    credentialsReceived(state, action) {
      const { token } = action.payload;

      state.token = token;
      state.userId = getUserIdFromToken(token);
      localStorage.setItem(STORAGE_KEY, token);
    },

    // The profile arrives separately from GET /users/:userId, since the login
    // response carries only a token.
    userLoaded(state, action) {
      state.user = action.payload;
    },

    logout(state) {
      state.token = null;
      state.userId = null;
      state.user = null;
      localStorage.removeItem(STORAGE_KEY);
    },

    // Dispatched by the base query on any 401.
    sessionExpired(state) {
      state.token = null;
      state.userId = null;
      state.user = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { credentialsReceived, userLoaded, logout, sessionExpired } =
  authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectCurrentUserId = (state) => state.auth.userId;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export default authSlice.reducer;
