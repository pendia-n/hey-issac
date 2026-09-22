PRAGMA foreign_keys = ON;

ALTER TABLE workspaces ADD COLUMN extra_offices INTEGER NOT NULL DEFAULT 0;
ALTER TABLE projects ADD COLUMN root_url TEXT;
ALTER TABLE projects ADD COLUMN focus_url TEXT;
ALTER TABLE projects ADD COLUMN watch_enabled INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS provider_key_ledger (
  key_label TEXT PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider = 'exa'),
  cycle_end TEXT NOT NULL,
  estimated_used_usd REAL NOT NULL DEFAULT 0 CHECK (estimated_used_usd >= 0),
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS one_time_purchases (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_session_id TEXT NOT NULL UNIQUE,
  product TEXT NOT NULL,
  site_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'fulfilled', 'failed')),
  created_at TEXT NOT NULL
);
