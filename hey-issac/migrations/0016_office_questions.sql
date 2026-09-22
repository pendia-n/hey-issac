CREATE TABLE IF NOT EXISTS office_questions (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_start TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  sources_json TEXT NOT NULL DEFAULT '[]',
  model TEXT NOT NULL,
  provider_request_id TEXT,
  provider_cost_usd REAL NOT NULL DEFAULT 0,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_office_questions_period
  ON office_questions(project_id, period_start, status);
