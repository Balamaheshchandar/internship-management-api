CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('Remote', 'Hybrid', 'On-site')),
  employment_type TEXT NOT NULL DEFAULT 'Internship',
  description TEXT NOT NULL,
  skills TEXT NOT NULL DEFAULT '[]',
  stipend TEXT,
  application_url TEXT,
  duration TEXT,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);