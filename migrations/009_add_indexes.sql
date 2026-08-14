CREATE INDEX IF NOT EXISTS idx_comments_task_id
ON comments(task_id);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id
ON tasks(project_id);

CREATE INDEX IF NOT EXISTS idx_tasks_status
ON tasks(status);