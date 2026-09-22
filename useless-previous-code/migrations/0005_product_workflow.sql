PRAGMA foreign_keys = ON;

ALTER TABLE users ADD COLUMN business_name TEXT;
ALTER TABLE users ADD COLUMN brand_voice TEXT;
UPDATE workspaces SET plan = 'starter' WHERE plan = 'free';

CREATE TABLE IF NOT EXISTS api_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL,
  last_used_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_api_tokens_hash ON api_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_api_tokens_workspace ON api_tokens(workspace_id, revoked_at);
