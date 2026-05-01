const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/jwt");

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log("[AUTH] Signup attempt:", { email, role: role || "member" });

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    console.warn("[AUTH] Signup blocked: email already exists.", { email });
    throw new ApiError(409, "User with this email already exists.");
  }

  const passwordHash = await User.hashPassword(password);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
  });

  const token = generateToken({ userId: user._id, role: user.role });
  console.log("[AUTH] Signup successful:", { userId: String(user._id), email: user.email });

  res.status(201).json({
    success: true,
    message: "Signup successful.",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("[AUTH] Login attempt:", { email });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.warn("[AUTH] Login failed: user not found.", { email });
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    console.warn("[AUTH] Login failed: password mismatch.", {
      userId: String(user._id),
      email,
    });
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken({ userId: user._id, role: user.role });
  console.log("[AUTH] Login successful:", { userId: String(user._id), email: user.email });

  res.json({
    success: true,
    message: "Login successful.",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

module.exports = {
  signup,
  login,
  me,
};
