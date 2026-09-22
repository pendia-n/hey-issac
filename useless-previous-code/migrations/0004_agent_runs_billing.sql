PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS wallets (
  workspace_id TEXT PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
  balance_cents INTEGER NOT NULL DEFAULT 0 CHECK (balance_cents >= 0),
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('top_up', 'run_charge', 'refund', 'adjustment')),
  amount_cents INTEGER NOT NULL,
  balance_after_cents INTEGER NOT NULL CHECK (balance_after_cents >= 0),
  idempotency_key TEXT NOT NULL UNIQUE,
  stripe_checkout_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  site_url TEXT NOT NULL,
  objective TEXT NOT NULL,
  addon TEXT NOT NULL DEFAULT 'default' CHECK (addon IN ('default', 'push', 'max')),
  tier TEXT NOT NULL DEFAULT 'starter' CHECK (tier IN ('starter', 'studio', 'partner')),
  model TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  result_json TEXT,
  provider_cost_usd REAL NOT NULL DEFAULT 0,
  charged_cents INTEGER NOT NULL DEFAULT 0,
  idempotency_key TEXT NOT NULL UNIQUE,
  error TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT
);
CREATE TABLE IF NOT EXISTS run_requests (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  request_key TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_request_id TEXT,
  provider_generation_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  provider_cost_usd REAL NOT NULL DEFAULT 0,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT
);
CREATE TABLE IF NOT EXISTS evidence_snapshots (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  query TEXT,
  url TEXT NOT NULL,
  title TEXT,
  excerpt TEXT,
  content_hash TEXT NOT NULL,
  fetched_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_runs_workspace_created ON runs(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_run_requests_run ON run_requests(run_id, created_at);
CREATE INDEX IF NOT EXISTS idx_evidence_run ON evidence_snapshots(run_id, fetched_at);
