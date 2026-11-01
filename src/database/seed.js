
require("dotenv").config();

const db = require("../config/database");
const records = require("../../data/seed-records.json");

const insert = db.prepare(`
  INSERT INTO internships
  (
    title, company, location, mode,
    employment_type, description, skills,
    stipend, application_url, duration, is_active
  )
  VALUES (
    @title, @company, @location, @mode,
    @employment_type, @description, @skills,
    @stipend, @application_url, @duration, @is_active
  )
`);

const seed = db.transaction((items) => {
  for (const item of items) {
    insert.run({
      employment_type: "Internship",
      skills: JSON.stringify(item.skills || []),
      stipend: null,
      application_url: null,
      duration: null,
      is_active: 1,
      ...item,
      skills: JSON.stringify(item.skills || []),
      is_active: item.is_active === false ? 0 : 1
    });
  }
});

const count = db.prepare(
  "SELECT COUNT(*) AS count FROM internships"
).get().count;

if (count === 0) {
  seed(records);
  console.log(`Inserted ${records.length} sample internship records.`);
} else {
  console.log("Database already contains records; seed skipped.");
}

db.close();
