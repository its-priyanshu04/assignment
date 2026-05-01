const express = require("express");
const { signup, login, me } = require("../controllers/authController");
const { signupValidator, loginValidator } = require("../validators/authValidators");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signupValidator, validate, signup);
router.post("/login", loginValidator, validate, login);
router.get("/me", authMiddleware, me);

module.exports = router;
