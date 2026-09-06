import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Card, EmptyState, Skeleton } from "../../components/ui/Card.jsx";
import { RoleBadge } from "../../components/ui/Badge.jsx";
import { TaskBoard } from "../tasks/TaskBoard.jsx";
import { MembersPanel } from "../members/MembersPanel.jsx";
import { ProjectSettings } from "./ProjectSettings.jsx";
import { useProjectRole } from "../../hooks/useProjectRole.js";
import { useGetProjectQuery } from "../../services/endpoints/projects.api.js";
import { cn } from "../../lib/cn.js";

const TABS = [
  { id: "board", label: "Board" },
  { id: "members", label: "Members" },
  { id: "settings", label: "Settings" },
];

export default function ProjectDetailPage() {
  const { projectId: projectIdParam } = useParams();
  const projectId = Number(projectIdParam);

  const [tab, setTab] = useState("board");
  const { data: project, isLoading, error } = useGetProjectQuery(projectId);
  const { role } = useProjectRole(projectId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <EmptyState
          title={error.status === 403 ? "No access to this project" : "Project unavailable"}
          description={error.message}
          action={
            <Link
              to="/projects"
              className="text-xs font-medium text-brand-700 hover:underline"
            >
              Back to projects
            </Link>
          }
        />
      </Card>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumb={
          <Link to="/projects" className="hover:text-ink">
            Projects
          </Link>
        }
        title={project.title}
        description={project.description}
        action={role && <RoleBadge role={role} />}
      />

      <div className="mb-5 flex gap-1 border-b border-line">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-xs font-medium transition-colors",
              tab === item.id
                ? "border-brand-400 text-ink"
                : "border-transparent text-ink-muted hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "board" && <TaskBoard projectId={projectId} />}
      {tab === "members" && <MembersPanel projectId={projectId} />}
      {tab === "settings" && <ProjectSettings project={project} />}
    </>
  );
}
