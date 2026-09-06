import { cn } from "../../lib/cn.js";
import { initialsOf } from "../../lib/format.js";

const SIZES = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
};

export function Avatar({ name, size = "md", className }) {
  return (
    <span
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "bg-brand-100 font-semibold text-brand-700 select-none",
        SIZES[size],
        className
      )}
    >
      {initialsOf(name) || "?"}
    </span>
  );
}
