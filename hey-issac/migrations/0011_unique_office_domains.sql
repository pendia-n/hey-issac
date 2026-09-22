CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_workspace_root
ON projects(workspace_id, root_url)
WHERE root_url IS NOT NULL;
