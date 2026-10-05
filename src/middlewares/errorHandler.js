// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages,
    });
  }

  // Sequelize unique constraint error (e.g. duplicate slug)
  if (err.name === "SequelizeUniqueConstraintError") {
    const fields = Object.keys(err.fields || {});
    return res.status(409).json({
      success: false,
      message: `Duplicate entry for ${fields.join(", ") || "field"}`,
    });
  }

  // Neon / Postgres connection error
  if (err.name === "SequelizeConnectionError" || err.name === "SequelizeConnectionRefusedError") {
    return res.status(503).json({
      success: false,
      message: "Database connection error. Please ensure your Neon database is active and reachable.",
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
