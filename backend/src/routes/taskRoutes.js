const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const { ROLES } = require("../constants");
const {
  createTask,
  listTasks,
  updateTaskStatus,
  deleteTask,
  dashboardSummary,
} = require("../controllers/taskController");
const {
  createTaskValidator,
  taskIdValidator,
  updateTaskStatusValidator,
  dashboardQueryValidator,
} = require("../validators/taskValidators");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listTasks);
router.get("/dashboard/summary", dashboardQueryValidator, validate, dashboardSummary);
router.post("/", roleMiddleware(ROLES.ADMIN), createTaskValidator, validate, createTask);
router.patch("/:taskId/status", updateTaskStatusValidator, validate, updateTaskStatus);
router.delete("/:taskId", roleMiddleware(ROLES.ADMIN), taskIdValidator, validate, deleteTask);

module.exports = router;
