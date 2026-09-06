import { useId } from "react";
import { cn } from "../../lib/cn.js";

const CONTROL_CLASS =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink " +
  "placeholder:text-ink-subtle transition-colors " +
  "hover:border-zinc-300 focus:border-brand-400 disabled:bg-zinc-50 disabled:text-ink-muted";

function Wrapper({ id, label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-ink-muted">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ label, hint, error, className, ...props }) {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  return (
    <Wrapper id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        className={cn(CONTROL_CLASS, error && "border-red-300", className)}
        {...props}
      />
    </Wrapper>
  );
}

export function Textarea({ label, hint, error, className, rows = 3, ...props }) {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  return (
    <Wrapper id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        rows={rows}
        className={cn(CONTROL_CLASS, "resize-y", error && "border-red-300", className)}
        {...props}
      />
    </Wrapper>
  );
}

export function Select({ label, hint, error, className, children, ...props }) {
  const generatedId = useId();
  const id = props.id ?? generatedId;

  return (
    <Wrapper id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        className={cn(CONTROL_CLASS, "cursor-pointer pr-8", error && "border-red-300", className)}
        {...props}
      >
        {children}
      </select>
    </Wrapper>
  );
}
