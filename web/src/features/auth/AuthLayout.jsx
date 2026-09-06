import { Logo } from "../../components/layout/Logo.jsx";

/** Split layout: form on the left, yellow brand panel on the right. */
export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Logo className="mb-8" />
          <h1 className="text-xl">{title}</h1>
          <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-xs text-ink-muted">{footer}</div>}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-brand-400 lg:block">
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <blockquote className="max-w-md text-2xl leading-snug font-semibold tracking-tight text-ink">
            Projects, tasks, and the people moving them — on one board.
          </blockquote>
          <p className="mt-4 text-sm text-ink/60">
            PulseBoard · team collaboration API client
          </p>
        </div>

        {/* Soft geometric wash so the yellow panel is not a flat block. */}
        <div className="absolute -top-24 -right-16 size-96 rounded-full bg-brand-300/60 blur-2xl" />
        <div className="absolute top-32 -left-10 size-64 rounded-full bg-brand-200/50 blur-2xl" />
      </div>
    </div>
  );
}
