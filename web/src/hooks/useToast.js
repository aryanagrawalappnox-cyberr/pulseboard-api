import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toastPushed } from "../features/ui/uiSlice.js";

/**
 * Toast helpers. `error` understands the normalised error shape produced by
 * services/baseQuery.js, so callers can pass an RTK Query error straight in.
 */
export function useToast() {
  const dispatch = useDispatch();

  const notify = useCallback(
    (message, tone = "info") => dispatch(toastPushed({ message, tone })),
    [dispatch]
  );

  const success = useCallback((message) => notify(message, "success"), [notify]);

  const error = useCallback(
    (source, fallback = "Something went wrong.") => {
      const message =
        typeof source === "string" ? source : source?.message || fallback;

      const details = typeof source === "object" ? source?.details : null;
      const firstDetail = details?.[0];

      notify(
        firstDetail ? `${message} — ${firstDetail.field}: ${firstDetail.message}` : message,
        "error"
      );
    },
    [notify]
  );

  return { notify, success, error };
}
