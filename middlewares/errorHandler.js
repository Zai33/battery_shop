import logger from "../utils/logger.js";

function normalizeError(err) {
  if (err instanceof Error) return err;
  const message = typeof err === "string" ? err : "Unknown error";
  const normalized = new Error(message);
  normalized.originalError = err;
  return normalized;
}

function getStatusCode(err) {
  if (!err) return 500;
  if (typeof err.statusCode === "number") return err.statusCode;

  // Mongoose
  if (err.name === "ValidationError") return 400;
  if (err.name === "CastError") return 400;

  // JWT
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")
    return 401;

  // Mongo duplicate key
  if (err.code === 11000) return 409;

  return 500;
}

function getErrorCode(err, statusCode) {
  if (!err) return "INTERNAL_SERVER_ERROR";

  if (err.code === 11000) return "DUPLICATE_KEY";
  if (typeof err.code === "string" && err.code.length > 0) return err.code;

  if (err.name === "ValidationError") return "VALIDATION_ERROR";
  if (err.name === "CastError") return "INVALID_ID";

  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")
    return "UNAUTHORIZED";

  if (statusCode >= 500) return "INTERNAL_SERVER_ERROR";
  if (statusCode === 400) return "BAD_REQUEST";
  if (statusCode === 401) return "UNAUTHORIZED";
  if (statusCode === 403) return "FORBIDDEN";
  if (statusCode === 404) return "NOT_FOUND";

  return `HTTP_${statusCode}`;
}

export default function errorHandler(err, req, res, next) {
  const normalizedError = normalizeError(err);
  const statusCode = getStatusCode(normalizedError);
  const code = getErrorCode(normalizedError, statusCode);

  const isProd = process.env.NODE_ENV === "production";
  const message =
    statusCode >= 500
      ? isProd
        ? "Internal server error"
        : normalizedError.message || "Internal server error"
      : normalizedError.message || "Request error";

  if (res.headersSent) return next(normalizedError);

  logger.error(normalizedError.message || "Unhandled error", {
    code,
    statusCode,
    method: req?.method,
    path: req?.originalUrl,
    stack: normalizedError.stack,
  });

  return res.status(statusCode).json({
    con: false,
    code,
    message,
  });
}

