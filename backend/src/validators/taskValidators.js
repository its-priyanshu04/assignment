const { body, param, query } = require("express-validator");
const { TASK_PRIORITY, TASK_STATUS } = require("../constants");

const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Task title is required."),
  body("description").optional().trim(),
  body("priority")
    .optional()
    .isIn([TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH])
    .withMessage("Priority must be Low, Medium, or High."),
  body("deadline")
    .isISO8601()
    .withMessage("Deadline must be a valid date (ISO8601)."),
  body("projectId").isMongoId().withMessage("projectId must be a valid id."),
  body("assignedTo").isMongoId().withMessage("assignedTo must be a valid id."),
];

const taskIdValidator = [param("taskId").isMongoId().withMessage("Invalid task id.")];

const updateTaskStatusValidator = [
  ...taskIdValidator,
  body("status")
    .isIn([TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED])
    .withMessage("Status must be Todo, In Progress, or Completed."),
];

const dashboardQueryValidator = [
  query("projectId").optional().isMongoId().withMessage("Invalid projectId."),
];

module.exports = {
  createTaskValidator,
  taskIdValidator,
  updateTaskStatusValidator,
  dashboardQueryValidator,
};
