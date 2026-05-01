const { body, param } = require("express-validator");

const objectIdMessage = "Invalid id format.";

const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Project name is required."),
  body("description").optional().trim(),
  body("deadline")
    .isISO8601()
    .withMessage("Deadline must be a valid date (ISO8601)."),
];

const projectIdValidator = [
  param("projectId").isMongoId().withMessage(objectIdMessage),
];

const addRemoveMemberValidator = [
  ...projectIdValidator,
  body("memberId").isMongoId().withMessage("memberId must be a valid id."),
];

module.exports = {
  createProjectValidator,
  projectIdValidator,
  addRemoveMemberValidator,
};
