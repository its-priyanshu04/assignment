const { body } = require("express-validator");
const { ROLES } = require("../constants");

const signupValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("role")
    .optional()
    .isIn([ROLES.ADMIN, ROLES.MEMBER])
    .withMessage("Role must be admin or member."),
];

const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

module.exports = {
  signupValidator,
  loginValidator,
};
