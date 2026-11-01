const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const internshipRoutes = require("./routes/internships");
const { notFound, errorHandler } = require("./middleware/errors");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Internship Management API",
    endpoints: { internships: "/api/internships", health: "/health" }
  });
});
app.get("/health", (_req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/internships", internshipRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;