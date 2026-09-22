CREATE TABLE IF NOT EXISTS provider_credit_ledger (
  key_label TEXT NOT NULL,
  period_start TEXT NOT NULL,
  used_credits INTEGER NOT NULL DEFAULT 0 CHECK (used_credits >= 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (key_label, period_start)
);
