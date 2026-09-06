import { Link } from "react-router-dom";
import { Logo } from "../components/layout/Logo.jsx";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <Logo />
      <div>
        <h1 className="text-2xl">Page not found</h1>
        <p className="mt-1 text-sm text-ink-muted">
          That route does not exist in PulseBoard.
        </p>
      </div>
      <Link
        to="/projects"
        className="inline-flex h-9 items-center rounded-lg border border-brand-500/30 bg-brand-400 px-4 text-sm font-medium text-ink transition-colors hover:bg-brand-300"
      >
        Back to projects
      </Link>
    </div>
  );
}
