import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearLog,
  selectDevLogEntries,
  selectDevPanelOpen,
  togglePanel,
} from "./devLogSlice.js";
import { selectCurrentUser, selectToken } from "../auth/authSlice.js";
import { API_BASE_URL } from "../../services/baseQuery.js";
import { getTokenExpiry } from "../../lib/jwt.js";
import { cn } from "../../lib/cn.js";

const METHOD_TONE = {
  GET: "text-sky-700 bg-sky-50",
  POST: "text-emerald-700 bg-emerald-50",
  PUT: "text-amber-700 bg-amber-50",
  DELETE: "text-red-700 bg-red-50",
};

function statusTone(status, ok) {
  if (ok) return "bg-emerald-50 text-emerald-700";
  if (status === 401 || status === 403) return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

function pretty(value) {
  if (value === undefined) return "—";

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/** Rebuilds an equivalent curl command so a call can be replayed in a shell. */
function toCurl(entry, token) {
  const parts = [`curl -X ${entry.method} '${API_BASE_URL}${entry.url}'`];

  if (token) parts.push(`-H 'Authorization: Bearer ${token}'`);

  if (entry.body && !entry.body._formData) {
    parts.push(`-H 'Content-Type: application/json'`);
    parts.push(`-d '${JSON.stringify(entry.body)}'`);
  }

  if (entry.body?._formData) {
    parts.push(`-F 'file=@/path/to/file'`);
  }

  return parts.join(" \\\n  ");
}

function TokenStrip({ user, token }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const expiresAt = getTokenExpiry(token);
  const secondsLeft = expiresAt ? Math.max(0, Math.floor((expiresAt - now) / 1000)) : null;

  const countdown =
    secondsLeft === null
      ? "—"
      : `${Math.floor(secondsLeft / 60)}m ${String(secondsLeft % 60).padStart(2, "0")}s`;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-line px-4 py-2 text-[11px] text-ink-muted">
      <span>
        User <span className="font-medium text-ink">{user?.name ?? "—"}</span>
        {user?.id != null && <span className="text-ink-subtle"> #{user.id}</span>}
      </span>
      <span>
        Token expires in{" "}
        <span
          className={cn(
            "font-mono font-medium",
            secondsLeft !== null && secondsLeft < 300 ? "text-red-600" : "text-ink"
          )}
        >
          {countdown}
        </span>
      </span>
      <span className="truncate">
        API <span className="font-mono text-ink">{API_BASE_URL}</span>
      </span>
    </div>
  );
}

function EntryRow({ entry, token }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="border-b border-line/70 last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center gap-3 px-4 py-1.5 text-left transition-colors hover:bg-zinc-50"
      >
        <span
          className={cn(
            "w-14 shrink-0 rounded px-1 py-0.5 text-center font-mono text-[10px] font-semibold",
            METHOD_TONE[entry.method] ?? "bg-zinc-100 text-zinc-700"
          )}
        >
          {entry.method}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink">
          {entry.url}
        </span>
        <span
          className={cn(
            "shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold",
            statusTone(entry.status, entry.ok)
          )}
        >
          {entry.status || "ERR"}
        </span>
        <span className="w-12 shrink-0 text-right font-mono text-[10px] text-ink-subtle">
          {entry.durationMs}ms
        </span>
      </button>

      {expanded && (
        <div className="space-y-3 bg-zinc-50/70 px-4 py-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-ink-muted uppercase">
                Request
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard?.writeText(toCurl(entry, token))
                }
                className="text-[10px] text-ink-subtle transition-colors hover:text-ink"
              >
                Copy as curl
              </button>
            </div>
            <pre className="scrollbar-slim max-h-40 overflow-auto rounded-md border border-line bg-surface p-2 font-mono text-[10px] leading-relaxed">
              {pretty(entry.body)}
            </pre>
          </div>

          <div>
            <span className="mb-1 block text-[10px] font-semibold text-ink-muted uppercase">
              Response
            </span>
            <pre className="scrollbar-slim max-h-52 overflow-auto rounded-md border border-line bg-surface p-2 font-mono text-[10px] leading-relaxed">
              {pretty(entry.response)}
            </pre>
          </div>
        </div>
      )}
    </li>
  );
}

export function DevPanel() {
  const dispatch = useDispatch();
  const entries = useSelector(selectDevLogEntries);
  const isOpen = useSelector(selectDevPanelOpen);
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);

  // Ctrl+` toggles the panel.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey && event.key === "`") {
        event.preventDefault();
        dispatch(togglePanel());
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dispatch]);

  const failures = entries.filter((entry) => !entry.ok).length;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => dispatch(togglePanel())}
        className="fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full border border-line bg-surface py-2 pr-3 pl-3.5 text-xs font-medium shadow-lg shadow-ink/10 transition-colors hover:border-brand-300 hover:bg-brand-50"
      >
        <span className="size-1.5 rounded-full bg-brand-400" />
        API log
        <span className="rounded-full bg-zinc-100 px-1.5 font-mono text-[10px] text-ink-muted">
          {entries.length}
        </span>
        {failures > 0 && (
          <span className="rounded-full bg-red-50 px-1.5 font-mono text-[10px] text-red-700">
            {failures}
          </span>
        )}
      </button>
    );
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface shadow-[0_-8px_24px_-12px_rgba(24,24,27,0.25)]">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-brand-400" />
          <h2 className="text-xs font-semibold">API request log</h2>
          <span className="text-[11px] text-ink-subtle">
            last {entries.length} · {failures} failed
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(clearLog())}
            className="text-[11px] text-ink-subtle transition-colors hover:text-ink"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => dispatch(togglePanel())}
            className="rounded px-1.5 text-ink-subtle transition-colors hover:bg-zinc-100 hover:text-ink"
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>
      </div>

      <TokenStrip user={user} token={token} />

      <ul className="scrollbar-slim max-h-72 overflow-y-auto">
        {entries.length === 0 ? (
          <li className="px-4 py-8 text-center text-[11px] text-ink-subtle">
            No requests yet. Every API call the app makes shows up here.
          </li>
        ) : (
          entries.map((entry) => (
            <EntryRow key={entry.id} entry={entry} token={token} />
          ))
        )}
      </ul>
    </aside>
  );
}
