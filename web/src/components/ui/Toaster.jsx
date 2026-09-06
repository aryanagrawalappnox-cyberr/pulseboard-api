import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToasts, toastDismissed } from "../../features/ui/uiSlice.js";
import { cn } from "../../lib/cn.js";

const TONES = {
  info: "border-line bg-surface text-ink",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

function Toast({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(toastDismissed(toast.id)), 4500);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-80 items-start gap-3 rounded-lg border px-3.5 py-2.5",
        "text-xs shadow-lg shadow-ink/5",
        TONES[toast.tone] ?? TONES.info
      )}
    >
      <span className="flex-1 leading-relaxed">{toast.message}</span>
      <button
        type="button"
        onClick={() => dispatch(toastDismissed(toast.id))}
        className="shrink-0 opacity-50 transition-opacity hover:opacity-100"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useSelector(selectToasts);

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
