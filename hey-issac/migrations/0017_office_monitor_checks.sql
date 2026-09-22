CREATE TABLE IF NOT EXISTS office_monitor_checks (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  period_start TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('checking', 'ready', 'unavailable')),
  started_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS office_monitor_checks_period_idx
  ON office_monitor_checks(project_id, period_start, started_at);
