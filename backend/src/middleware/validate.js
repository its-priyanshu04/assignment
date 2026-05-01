const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn("[VALIDATION] Request validation failed:", {
      method: req.method,
      path: req.originalUrl,
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.path === "password" ? "[REDACTED]" : error.value,
      })),
    });
    return next(new ApiError(400, errors.array()[0].msg));
  }
  next();
};

module.exports = validate;
