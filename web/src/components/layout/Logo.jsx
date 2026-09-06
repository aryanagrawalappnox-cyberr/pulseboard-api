import { cn } from "../../lib/cn.js";

export function Logo({ className, compact = false }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-400">
        <svg viewBox="0 0 32 32" className="size-5" aria-hidden="true">
          <path
            d="M6 17h4l3-7 4 13 3-8h6"
            fill="none"
            stroke="#18181B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="text-base font-semibold tracking-tight">PulseBoard</span>
      )}
    </div>
  );
}
