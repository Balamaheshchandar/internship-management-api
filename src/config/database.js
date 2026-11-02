const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const configuredPath = process.env.DATABASE_FILE || "./data/internships.db";
const dbPath = path.resolve(configuredPath);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
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
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    internship_id INTEGER NOT NULL,
    applicant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    resume_url TEXT,
    cover_letter TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (internship_id)
      REFERENCES internships(id)
      ON DELETE CASCADE
  );
`);

module.exports = db;