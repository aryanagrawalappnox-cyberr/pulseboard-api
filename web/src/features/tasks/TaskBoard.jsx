import { useState } from "react";
import { Button } from "../../components/ui/Button.jsx";
import { Card, EmptyState, Skeleton } from "../../components/ui/Card.jsx";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { TaskFormModal } from "./TaskFormModal.jsx";
import { TaskDetailDrawer } from "./TaskDetailDrawer.jsx";
import { useGetTasksQuery } from "../../services/endpoints/tasks.api.js";
import { TASK_STATUS_LIST } from "../../lib/constants.js";
import { formatRelative } from "../../lib/format.js";
import { cn } from "../../lib/cn.js";

const COLUMN_ACCENT = {
  Pending: "bg-zinc-300",
  "In Progress": "bg-brand-400",
  Completed: "bg-emerald-400",
};

function TaskCard({ task, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className={cn(
        "w-full rounded-lg border border-line bg-surface p-3 text-left transition-colors",
        "hover:border-brand-300 hover:bg-brand-50/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-snug font-medium">{task.title}</p>
        <span className="shrink-0 font-mono text-[10px] text-ink-subtle">
          #{task.id}
        </span>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Avatar name={task.created_by_name} size="sm" />
          <span className="text-[11px] text-ink-muted">
            {task.created_by_name ?? "Unknown"}
          </span>
        </div>
        <span className="text-[11px] text-ink-subtle">
          {formatRelative(task.created_at)}
        </span>
      </div>
    </button>
  );
}

function Column({ status, tasks, onOpen, onAdd }) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-line bg-zinc-50/60">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", COLUMN_ACCENT[status])} />
          <h3 className="text-xs font-semibold">{status}</h3>
          <span className="rounded-md bg-zinc-200/70 px-1.5 text-[10px] font-medium text-ink-muted">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(status)}
          className="rounded-md px-1.5 text-base leading-none text-ink-subtle transition-colors hover:bg-zinc-200 hover:text-ink"
          aria-label={`Add task to ${status}`}
        >
          +
        </button>
      </div>

      <div className="scrollbar-slim flex max-h-[calc(100vh-19rem)] flex-col gap-2 overflow-y-auto px-2 pb-2">
        {tasks.length === 0 ? (
          <p className="px-1 py-6 text-center text-[11px] text-ink-subtle">
            Nothing here yet
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpen} />
          ))
        )}
      </div>
    </div>
  );
}

export function TaskBoard({ projectId }) {
  const { data: tasks, isLoading } = useGetTasksQuery(projectId);

  const [formOpen, setFormOpen] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [openTaskId, setOpenTaskId] = useState(null);

  const openTask = tasks?.find((task) => task.id === openTaskId) ?? null;

  const onAdd = (status) => {
    setFormStatus(status);
    setFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {TASK_STATUS_LIST.map((status) => (
          <Skeleton key={status} className="h-64 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <>
        <Card>
          <EmptyState
            title="No tasks yet"
            description="Add the first task to get this board moving."
            action={<Button onClick={() => onAdd(undefined)}>New task</Button>}
          />
        </Card>
        <TaskFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          projectId={projectId}
          defaultStatus={formStatus}
        />
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => onAdd(undefined)}>
          New task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {TASK_STATUS_LIST.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onOpen={(task) => setOpenTaskId(task.id)}
            onAdd={onAdd}
          />
        ))}
      </div>

      <TaskFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        projectId={projectId}
        defaultStatus={formStatus}
      />

      <TaskDetailDrawer
        task={openTask}
        projectId={projectId}
        onClose={() => setOpenTaskId(null)}
      />
    </>
  );
}
