const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { ROLES } = require("../constants");

const listUsers = asyncHandler(async (req, res) => {
  const filter = req.user.role === ROLES.ADMIN ? {} : { _id: req.user._id };
  const users = await User.find(filter).select("-passwordHash").sort({ createdAt: -1 });

  res.json({
    success: true,
    data: users,
  });
});

module.exports = {
  listUsers,
};
