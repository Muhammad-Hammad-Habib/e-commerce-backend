export function AppError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export function parseId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw AppError("Invalid ID", 400);
  }

  return id;
}

export function notFound(req, res, next) {
  next(AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Image is too large. Maximum size is 5 MB",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      message: "Unexpected file field. Use the field name: image",
    });
  }

  if (err.code === "P2002") {
    const fields = Array.isArray(err.meta?.target)
      ? err.meta.target.join(", ")
      : "unique field";

    return res.status(409).json({
      success: false,
      message: `A record with this ${fields} already exists`,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  if (err.code === "P2003") {
    return res.status(400).json({
      success: false,
      message: "Related record not found. Check your IDs",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

export function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
