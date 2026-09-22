ALTER TABLE workspaces ADD COLUMN current_period_start TEXT;
ALTER TABLE workspaces ADD COLUMN extra_offices_subscription_id TEXT;

ALTER TABLE projects ADD COLUMN monitor_next_at TEXT;
ALTER TABLE projects ADD COLUMN monitor_last_checked_at TEXT;
ALTER TABLE projects ADD COLUMN monitor_last_status TEXT NOT NULL DEFAULT 'not_enabled';

CREATE TABLE IF NOT EXISTS project_monitor_snapshots (
  project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS office_events (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('site_change', 'market_result')),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  source_url TEXT NOT NULL,
  evidence_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (project_id, evidence_hash)
);

CREATE INDEX IF NOT EXISTS idx_office_events_project_created
  ON office_events(project_id, created_at DESC);
