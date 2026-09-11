CREATE TABLE IF NOT EXISTS password_change_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  changed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_password_change_events_user_time
  ON password_change_events(user_id, changed_at);
