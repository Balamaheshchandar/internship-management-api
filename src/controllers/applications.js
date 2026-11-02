
const db = require("../config/database");

function submit(req, res) {
  const {
    internship_id,
    applicant_name,
    email,
    phone,
    resume_url,
    cover_letter
  } = req.body || {};

  const errors = [];

  if (!Number.isInteger(Number(internship_id)) || Number(internship_id) < 1) {
    errors.push("A valid internship_id is required");
  }

  if (typeof applicant_name !== "string" || applicant_name.trim().length < 2 || applicant_name.trim().length > 100) {
    errors.push("Applicant name must be between 2 and 100 characters");
  }

  if (typeof email !== "string" || !/^[^ @]+@[^ @]+[.][^ @]+$/.test(email.trim()) || email.length > 254) {
  errors.push("A valid email address is required");
}

if (typeof phone !== "string" || !/^[0-9+() -]{7,20}$/.test(phone.trim())) {
    errors.push("Enter a valid phone number");
  }
  if (resume_url && typeof resume_url !== "string") {
    errors.push("Resume URL must be text");
  } else if (resume_url) {
    try {
      const url = new URL(resume_url);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      errors.push("Resume URL must be a valid HTTP or HTTPS URL");
    }
  }

  if (cover_letter && (typeof cover_letter !== "string" || cover_letter.length > 2000)) {
    errors.push("Cover letter must be 2000 characters or fewer");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        details: errors
      }
    });
  }

  const internship = db.prepare(
    "SELECT id FROM internships WHERE id = ? AND is_active = 1"
  ).get(Number(internship_id));

  if (!internship) {
    return res.status(404).json({
      success: false,
      error: {
        code: "INTERNSHIP_NOT_FOUND",
        message: "Internship not found or inactive"
      }
    });
  }

  const result = db.prepare(`
    INSERT INTO applications
    (internship_id, applicant_name, email, phone, resume_url, cover_letter)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    Number(internship_id),
    applicant_name.trim(),
    email.trim().toLowerCase(),
    phone.trim(),
    resume_url || null,
    cover_letter || null
  );

  return res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application_id: result.lastInsertRowid
  });
}

module.exports = { submit };
