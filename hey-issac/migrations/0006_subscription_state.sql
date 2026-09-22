ALTER TABLE workspaces ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE workspaces ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE workspaces ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE workspaces ADD COLUMN current_period_end TEXT;

CREATE INDEX IF NOT EXISTS idx_workspaces_subscription ON workspaces(stripe_subscription_id);
