CREATE TABLE IF NOT EXISTS provider_key_state (
  provider TEXT NOT NULL,
  slot INTEGER NOT NULL,
  blocked_until INTEGER NOT NULL DEFAULT 0,
  remaining REAL,
  remaining_checked_at INTEGER,
  consumed_estimate REAL NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (provider, slot)
);
