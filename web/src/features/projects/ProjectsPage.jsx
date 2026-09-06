import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, EmptyState, Skeleton } from "../../components/ui/Card.jsx";
import { ProjectFormModal } from "./ProjectFormModal.jsx";
import { useGetProjectsQuery } from "../../services/endpoints/projects.api.js";
import { PAGE_SIZE } from "../../lib/constants.js";
import { formatDate } from "../../lib/format.js";

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group rounded-xl focus-visible:ring-2"
    >
      <Card className="h-full p-5 transition-colors group-hover:border-brand-300 group-hover:bg-brand-50/40">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-semibold group-hover:text-brand-700">
            {project.title}
          </h2>
          <span className="shrink-0 rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
            #{project.id}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-muted">
          {project.description || "No description."}
        </p>
        <p className="mt-4 text-[11px] text-ink-subtle">
          Created {formatDate(project.created_at)}
        </p>
      </Card>
    </Link>
  );
}

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);

  const { data: projects, isLoading, isFetching } = useGetProjectsQuery({
    page,
    limit: PAGE_SIZE,
  });

  // The API returns no total count, so a full page implies there may be more.
  const hasNextPage = (projects?.length ?? 0) === PAGE_SIZE;

  return (
    <>
      <PageHeader
        title="Projects"
        description="Every project you are a member of."
        action={<Button onClick={() => setFormOpen(true)}>New project</Button>}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : projects?.length ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {(page > 1 || hasNextPage) && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1 || isFetching}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </Button>
              <span className="text-xs text-ink-muted">Page {page}</span>
              <Button
                variant="secondary"
                size="sm"
                disabled={!hasNextPage || isFetching}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <EmptyState
            title="No projects yet"
            description="Create your first project to start adding tasks and teammates."
            action={<Button onClick={() => setFormOpen(true)}>New project</Button>}
          />
        </Card>
      )}

      <ProjectFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
