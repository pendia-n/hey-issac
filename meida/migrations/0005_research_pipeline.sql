ALTER TABLE rooms ADD COLUMN overview_json TEXT;
ALTER TABLE rooms ADD COLUMN profile_checked_at INTEGER;
ALTER TABLE rooms ADD COLUMN discovery_checked_at INTEGER;
ALTER TABLE rooms ADD COLUMN candidates_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE competitors ADD COLUMN summary TEXT NOT NULL DEFAULT '';
ALTER TABLE competitors ADD COLUMN source_url TEXT;
ALTER TABLE competitors ADD COLUMN confidence TEXT NOT NULL DEFAULT 'unverified';
ALTER TABLE competitors ADD COLUMN last_checked_at INTEGER;
ALTER TABLE findings ADD COLUMN provider TEXT;
ALTER TABLE findings ADD COLUMN subject_domain TEXT;
ALTER TABLE reviews ADD COLUMN advice_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE reviews ADD COLUMN evidence_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE provider_key_state ADD COLUMN reset_at INTEGER;
ALTER TABLE provider_key_state ADD COLUMN lease_until INTEGER NOT NULL DEFAULT 0;
CREATE TABLE review_history (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  checked_at INTEGER NOT NULL,
  review_json TEXT NOT NULL
);
CREATE INDEX review_history_room ON review_history(room_id, checked_at DESC);
CREATE TABLE research_jobs (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  slot TEXT NOT NULL,
  due_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  lease_until INTEGER NOT NULL DEFAULT 0,
  completed_at INTEGER,
  UNIQUE(room_id, kind, subject, slot)
);
CREATE INDEX research_jobs_due ON research_jobs(completed_at, due_at, lease_until);
CREATE TABLE research_scheduler (id INTEGER PRIMARY KEY, enqueued_through INTEGER NOT NULL);
INSERT INTO research_scheduler(id,enqueued_through) VALUES (1,unixepoch()*1000);
CREATE TABLE provider_costs (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  slot INTEGER NOT NULL,
  purpose TEXT NOT NULL,
  cost REAL NOT NULL,
  estimated INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX provider_costs_period ON provider_costs(provider, slot, created_at);
