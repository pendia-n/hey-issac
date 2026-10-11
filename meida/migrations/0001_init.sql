CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  session_version INTEGER NOT NULL DEFAULT 0,
  password_changed_at INTEGER,
  password_changes_24h INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_attempts (
  key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('solo','studio','partner')),
  status TEXT NOT NULL,
  current_period_end INTEGER NOT NULL DEFAULT 0,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  first_paid_at INTEGER,
  first_payment_intent TEXT,
  first_payment_amount INTEGER,
  first_payment_currency TEXT,
  first_refund_id TEXT
);

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  root_domain TEXT NOT NULL,
  submitted_url TEXT NOT NULL,
  display_name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_private INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  last_checked_at INTEGER,
  last_review_at INTEGER,
  UNIQUE (owner_id, root_domain)
);
CREATE INDEX IF NOT EXISTS rooms_public_idx ON rooms(is_private, created_at DESC);
CREATE INDEX IF NOT EXISTS rooms_check_idx ON rooms(last_checked_at);

CREATE TABLE IF NOT EXISTS competitors (
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  root_domain TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY(room_id, root_domain)
);

CREATE TABLE IF NOT EXISTS findings (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT NOT NULL,
  published_at INTEGER,
  fetched_at INTEGER NOT NULL,
  pose INTEGER NOT NULL DEFAULT 0,
  UNIQUE(room_id, fingerprint)
);
CREATE INDEX IF NOT EXISTS findings_room_idx ON findings(room_id, fetched_at DESC);

CREATE TABLE IF NOT EXISTS reviews (
  room_id TEXT PRIMARY KEY REFERENCES rooms(id) ON DELETE CASCADE,
  checked_at INTEGER NOT NULL,
  source_url TEXT NOT NULL,
  status TEXT NOT NULL,
  title TEXT,
  description TEXT,
  canonical TEXT,
  h1 TEXT,
  robots TEXT,
  issues_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS usage (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  kind TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(user_id, month, kind)
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('user','assistant')),
  content TEXT NOT NULL,
  citations_json TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS conversations_scope_idx ON conversations(room_id, user_id, created_at);

CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
);
