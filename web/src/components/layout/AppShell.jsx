import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar.jsx";
import { DevPanel } from "../../features/devtools/DevPanel.jsx";

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>
      <DevPanel />
    </div>
  );
}
