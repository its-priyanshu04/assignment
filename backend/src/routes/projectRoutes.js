const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");
const { ROLES } = require("../constants");
const {
  createProject,
  listProjects,
  deleteProject,
  addMember,
  removeMember,
} = require("../controllers/projectController");
const {
  createProjectValidator,
  projectIdValidator,
  addRemoveMemberValidator,
} = require("../validators/projectValidators");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listProjects);
router.post("/", roleMiddleware(ROLES.ADMIN), createProjectValidator, validate, createProject);
router.delete(
  "/:projectId",
  roleMiddleware(ROLES.ADMIN),
  projectIdValidator,
  validate,
  deleteProject
);
router.patch(
  "/:projectId/members/add",
  roleMiddleware(ROLES.ADMIN),
  addRemoveMemberValidator,
  validate,
  addMember
);
router.patch(
  "/:projectId/members/remove",
  roleMiddleware(ROLES.ADMIN),
  addRemoveMemberValidator,
  validate,
  removeMember
);

module.exports = router;
