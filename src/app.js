const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const internshipRoutes = require("./routes/internships");
const { notFound, errorHandler } = require("./middleware/errors");
const applicationRoutes = require("./routes/applications");

const app = express();
app.use(helmet());
app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "100kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again later."
    }
  }
});

app.use("/api", apiLimiter);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Internship Management API",
    endpoints: { internships: "/api/internships", health: "/health" }
  });
});
app.get("/health", (_req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;