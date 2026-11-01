function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { code: "ROUTE_NOT_FOUND", message: `Route ${req.method} ${req.originalUrl} was not found` }
  });
}

function errorHandler(err, _req, res, _next) {
  console.error(err);
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_JSON", message: "Request body must contain valid JSON" }
    });
  }
  return res.status(500).json({
    success: false,
    error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected server error occurred" }
  });
}

module.exports = { notFound, errorHandler };