PRAGMA foreign_keys = ON;

ALTER TABLE one_time_purchases ADD COLUMN run_id TEXT;
CREATE INDEX IF NOT EXISTS idx_first_brief_run ON one_time_purchases(run_id);
