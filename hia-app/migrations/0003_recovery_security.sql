ALTER TABLE users ADD COLUMN recovery_email TEXT;
ALTER TABLE users ADD COLUMN totp_secret TEXT;
ALTER TABLE users ADD COLUMN passcode_hash TEXT;
ALTER TABLE users ADD COLUMN updated_at TEXT;

CREATE TABLE IF NOT EXISTS security_answers (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  answer_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, question_key)
);
