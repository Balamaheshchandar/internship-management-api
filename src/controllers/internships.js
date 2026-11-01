const db = require("../config/database");

const allowedModes = ["Remote", "Hybrid", "On-site"];
const allowedFields = [
  "title", "company", "location", "mode", "employment_type",
  "description", "skills", "stipend", "application_url", "duration", "is_active"
];

function serialize(row) {
  return { ...row, skills: JSON.parse(row.skills), is_active: Boolean(row.is_active) };
}

function validate(body, partial = false) {
  const errors = [];
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return ["Request body must be a JSON object"];
  }

  const required = ["title", "company", "location", "mode", "description"];
  if (!partial) {
    for (const field of required) {
      if (typeof body[field] !== "string" || !body[field].trim()) {
        errors.push(`${field} is required and must be a non-empty string`);
      }
    }
  } else {
    for (const field of required) {
      if (field in body && (typeof body[field] !== "string" || !body[field].trim())) {
        errors.push(`${field} must be a non-empty string`);
      }
    }
  }

  if ("mode" in body && !allowedModes.includes(body.mode)) {
    errors.push(`mode must be one of: ${allowedModes.join(", ")}`);
  }
  if ("skills" in body && (!Array.isArray(body.skills) || body.skills.some(s => typeof s !== "string"))) {
    errors.push("skills must be an array of strings");
  }
  if ("is_active" in body && ![true, false, 0, 1].includes(body.is_active)) {
    errors.push("is_active must be a boolean");
  }
  if ("application_url" in body && body.application_url) {
    try {
      const url = new URL(body.application_url);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      errors.push("application_url must be a valid HTTP or HTTPS URL");
    }
  }
  for (const field of ["title", "company", "location", "description"]) {
    if (field in body && typeof body[field] === "string" && body[field].length > 2000) {
      errors.push(`${field} must be 2000 characters or fewer`);
    }
  }
  const unknown = Object.keys(body).filter(key => !allowedFields.includes(key));
  if (unknown.length) errors.push(`Unknown field(s): ${unknown.join(", ")}`);
  return errors;
}

function toDb(body) {
  const values = { ...body };
  if (Array.isArray(values.skills)) values.skills = JSON.stringify(values.skills);
  if (typeof values.is_active === "boolean") values.is_active = values.is_active ? 1 : 0;
  return values;
}

function list(req, res) {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
  const offset = (page - 1) * limit;
  const search = (req.query.search || "").trim();
  const active = req.query.active;

  let where = [];
  let params = [];
  if (search) {
    where.push("(title LIKE ? OR company LIKE ? OR location LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (active === "true" || active === "false") {
    where.push("is_active = ?");
    params.push(active === "true" ? 1 : 0);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const total = db.prepare(`SELECT COUNT(*) AS count FROM internships ${clause}`).get(...params).count;
  const rows = db.prepare(
    `SELECT * FROM internships ${clause} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`
  ).all(...params, limit, offset);

  res.json({
    success: true,
    data: rows.map(serialize),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
}

function getById(req, res) {
  const row = db.prepare("SELECT * FROM internships WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Internship not found" } });
  res.json({ success: true, data: serialize(row) });
}

function create(req, res) {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Please correct the supplied data", details: errors } });

  const body = toDb(req.body);
  const result = db.prepare(`
    INSERT INTO internships
    (title, company, location, mode, employment_type, description, skills, stipend, application_url, duration, is_active)
    VALUES (@title, @company, @location, @mode, @employment_type, @description, @skills, @stipend, @application_url, @duration, @is_active)
  `).run({
    employment_type: "Internship", skills: "[]", stipend: null, application_url: null,
    duration: null, is_active: 1, ...body
  });
  const row = db.prepare("SELECT * FROM internships WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ success: true, message: "Internship created", data: serialize(row) });
}

function update(req, res) {
  const errors = validate(req.body, true);
  if (errors.length) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Please correct the supplied data", details: errors } });
  const current = db.prepare("SELECT * FROM internships WHERE id = ?").get(req.params.id);
  if (!current) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Internship not found" } });

  const body = toDb(req.body);
  const merged = { ...current, ...body, updated_at: new Date().toISOString() };
  db.prepare(`
    UPDATE internships SET title=@title, company=@company, location=@location, mode=@mode,
    employment_type=@employment_type, description=@description, skills=@skills, stipend=@stipend,
    application_url=@application_url, duration=@duration, is_active=@is_active,
    updated_at=datetime('now') WHERE id=@id
  `).run(merged);
  const updated = db.prepare("SELECT * FROM internships WHERE id = ?").get(req.params.id);
  res.json({ success: true, message: "Internship updated", data: serialize(updated) });
}

function remove(req, res) {
  const result = db.prepare("DELETE FROM internships WHERE id = ?").run(req.params.id);
  if (!result.changes) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Internship not found" } });
  res.json({ success: true, message: "Internship deleted" });
}

module.exports = { list, getById, create, update, remove };