import { cn } from "../../lib/cn.js";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn("rounded-xl border border-line bg-surface", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action, className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-line px-4 py-3",
        className
      )}
    >
      <h3 className="text-sm">{title}</h3>
      {action}
    </div>
  );
}

export function EmptyState({ title, description, action, icon }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      {icon && (
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-zinc-100", className)} />;
}
