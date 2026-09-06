import { cn } from "../../lib/cn.js";

export function Spinner({ className }) {
  return (
    <svg
      className={cn("animate-spin size-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoadingBlock({ label = "Loading" }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-ink-muted">
      <Spinner />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
