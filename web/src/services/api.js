import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithEnvelope } from "./baseQuery.js";

/**
 * Single API slice for the whole app. Endpoints are injected per resource from
 * `services/endpoints/*` so each file stays focused, while sharing one cache,
 * one base query and one set of tags.
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithEnvelope,
  tagTypes: ["User", "Project", "Member", "Task", "Comment", "Attachment"],
  endpoints: () => ({}),
});
