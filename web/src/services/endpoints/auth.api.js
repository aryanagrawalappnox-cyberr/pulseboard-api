import { api } from "../api.js";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Returns `{ token }` only — the caller derives the user from the JWT.
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Returns the created user but no token, so the UI chains a login call.
    signup: builder.mutation({
      query: (payload) => ({
        url: "/auth/signup",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
