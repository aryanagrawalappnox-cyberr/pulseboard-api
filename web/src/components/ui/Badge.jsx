import { cn } from "../../lib/cn.js";
import { TASK_STATUS, PROJECT_ROLE } from "../../lib/constants.js";

const TONES = {
  neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
  brand: "bg-brand-100 text-brand-700 border-brand-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  danger: "bg-red-50 text-red-700 border-red-200",
};

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// Status accents live on badges only, so yellow stays the app's identity.
const STATUS_TONE = {
  [TASK_STATUS.PENDING]: "neutral",
  [TASK_STATUS.IN_PROGRESS]: "brand",
  [TASK_STATUS.COMPLETED]: "success",
};

export function StatusBadge({ status }) {
  return <Badge tone={STATUS_TONE[status] ?? "neutral"}>{status}</Badge>;
}

export function RoleBadge({ role }) {
  return (
    <Badge tone={role === PROJECT_ROLE.ADMIN ? "brand" : "neutral"}>{role}</Badge>
  );
}
