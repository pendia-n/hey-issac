CREATE TABLE actions_v2 (
  id TEXT PRIMARY KEY,
  scan_id TEXT NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  score REAL,
  confidence REAL,
  evidence_json TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  draft TEXT,
  risk TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  approval_required INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

INSERT INTO actions_v2 (
  id, scan_id, project_id, type, priority, score, confidence, evidence_json,
  diagnosis, recommended_action, draft, risk, status, approval_required, created_at
)
SELECT
  id, scan_id, project_id, type, priority, NULL, NULL, evidence_json,
  diagnosis, recommended_action, draft, risk, status, approval_required, created_at
FROM actions;

DROP TABLE actions;
ALTER TABLE actions_v2 RENAME TO actions;
