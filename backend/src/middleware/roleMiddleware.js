const ApiError = require("../utils/ApiError");

const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, "Forbidden: insufficient permissions."));
  }
  next();
};

module.exports = roleMiddleware;
