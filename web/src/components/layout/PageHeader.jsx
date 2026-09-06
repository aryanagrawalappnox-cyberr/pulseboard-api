export function PageHeader({ title, description, action, breadcrumb }) {
  return (
    <div className="mb-6">
      {breadcrumb && <div className="mb-2 text-xs text-ink-muted">{breadcrumb}</div>}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
