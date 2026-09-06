import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { logRequest } from "../features/devtools/devLogSlice.js";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

function describeArgs(args) {
  const request = typeof args === "string" ? { url: args, method: "GET" } : args;

  return {
    method: (request.method || "GET").toUpperCase(),
    url: request.url,
    // FormData is not serialisable into the log; show a placeholder instead.
    body:
      request.body instanceof FormData
        ? { _formData: [...request.body.keys()] }
        : request.body,
  };
}

/**
 * Wraps fetchBaseQuery to do three things every endpoint needs:
 *
 *  1. Unwrap the API's `{ success, data }` envelope so hooks receive `data`.
 *  2. Normalise `{ success: false, error }` into a flat, displayable shape.
 *  3. Tee every call into the dev log, which is what powers the dev panel
 *     without any per-endpoint wiring.
 *
 * A 401 clears the session; `authSlice` listens for `auth/sessionExpired`.
 */
export const baseQueryWithEnvelope = async (args, api, extraOptions) => {
  const startedAt = performance.now();
  const described = describeArgs(args);

  const result = await rawBaseQuery(args, api, extraOptions);

  const duration = Math.round(performance.now() - startedAt);
  const status = result.error?.status ?? result.meta?.response?.status ?? 0;

  api.dispatch(
    logRequest({
      ...described,
      status,
      durationMs: duration,
      ok: !result.error,
      response: result.error ? result.error.data : result.data,
    })
  );

  if (result.error) {
    const payload = result.error.data;

    if (result.error.status === 401) {
      api.dispatch({ type: "auth/sessionExpired" });
    }

    return {
      error: {
        status: result.error.status,
        code: payload?.error?.code ?? "REQUEST_FAILED",
        message:
          payload?.error?.message ??
          (typeof payload === "string" ? payload : null) ??
          "Something went wrong. Please try again.",
        details: payload?.error?.details ?? [],
      },
    };
  }

  // Every successful API response is wrapped in `{ success: true, data }`.
  return { data: result.data?.data ?? result.data };
};
