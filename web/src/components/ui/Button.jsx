import { cn } from "../../lib/cn.js";
import { Spinner } from "./Spinner.jsx";

const VARIANTS = {
  // Near-black on yellow: white text on yellow fails contrast.
  primary:
    "bg-brand-400 text-ink hover:bg-brand-300 active:bg-brand-500 border border-brand-500/30 font-medium",
  secondary:
    "bg-surface text-ink border border-line hover:bg-zinc-50 active:bg-zinc-100",
  ghost: "bg-transparent text-ink-muted hover:bg-zinc-100 hover:text-ink",
  danger:
    "bg-surface text-red-600 border border-red-200 hover:bg-red-50 active:bg-red-100",
  dangerSolid: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700",
};

const SIZES = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg whitespace-nowrap transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner className="size-3.5" />}
      {children}
    </button>
  );
}
