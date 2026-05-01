const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { ROLES, TASK_STATUS } = require("../constants");

const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, deadline, projectId, assignedTo } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  if (String(project.owner) !== String(req.user._id)) {
    throw new ApiError(403, "Only the owning admin can assign tasks.");
  }

  const assignee = await User.findById(assignedTo);
  if (!assignee) {
    throw new ApiError(404, "Assigned user not found.");
  }

  const isMember =
    String(project.owner) === String(assignedTo) ||
    project.members.some((memberId) => String(memberId) === String(assignedTo));

  if (!isMember) {
    throw new ApiError(400, "Assigned user must belong to this project.");
  }

  const task = await Task.create({
    title,
    description,
    priority,
    deadline,
    project: projectId,
    assignedTo,
    createdBy: req.user._id,
  });

  const populated = await task.populate([
    { path: "project", select: "name description deadline" },
    { path: "assignedTo", select: "name email role" },
  ]);

  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: populated,
  });
});

const listTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  const query = {};

  if (req.user.role === ROLES.MEMBER) {
    query.assignedTo = req.user._id;
  }

  if (projectId) {
    query.project = projectId;
  }

  if (req.user.role === ROLES.ADMIN) {
    const adminProjectIds = await Project.find({ owner: req.user._id }).distinct("_id");
    query.project = query.project
      ? { $in: adminProjectIds.filter((id) => String(id) === String(projectId)) }
      : { $in: adminProjectIds };
  }

  const tasks = await Task.find(query)
    .populate("project", "name description deadline owner")
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 });

  const now = new Date();
  const withOverdue = tasks.map((task) => ({
    ...task.toObject(),
    isOverdue: task.status !== TASK_STATUS.COMPLETED && new Date(task.deadline) < now,
  }));

  res.json({
    success: true,
    data: withOverdue,
  });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  if (
    req.user.role === ROLES.MEMBER &&
    String(task.assignedTo) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can only update your own assigned tasks.");
  }

  if (req.user.role === ROLES.ADMIN) {
    const project = await Project.findById(task.project);
    if (!project || String(project.owner) !== String(req.user._id)) {
      throw new ApiError(403, "Only the owning admin can update this task.");
    }
  }

  task.status = status;
  await task.save();

  const populated = await task.populate([
    { path: "project", select: "name description deadline owner" },
    { path: "assignedTo", select: "name email role" },
  ]);

  res.json({
    success: true,
    message: "Task status updated successfully.",
    data: populated,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId).populate("project", "owner");

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  if (String(task.project.owner) !== String(req.user._id)) {
    throw new ApiError(403, "Only the owning admin can delete this task.");
  }

  await task.deleteOne();

  res.json({
    success: true,
    message: "Task deleted successfully.",
  });
});

const dashboardSummary = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  const query = {};

  if (req.user.role === ROLES.ADMIN) {
    const adminProjectIds = await Project.find({ owner: req.user._id }).distinct("_id");
    query.project = projectId
      ? { $in: adminProjectIds.filter((id) => String(id) === String(projectId)) }
      : { $in: adminProjectIds };
  } else {
    query.assignedTo = req.user._id;
    if (projectId) {
      query.project = projectId;
    }
  }

  const tasks = await Task.find(query).select("status deadline");
  const now = new Date();

  const summary = tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      if (task.status === TASK_STATUS.COMPLETED) {
        acc.completed += 1;
      } else {
        acc.pending += 1;
      }
      if (task.status !== TASK_STATUS.COMPLETED && new Date(task.deadline) < now) {
        acc.overdue += 1;
      }
      return acc;
    },
    { total: 0, completed: 0, pending: 0, overdue: 0 }
  );

  res.json({
    success: true,
    data: summary,
  });
});

module.exports = {
  createTask,
  listTasks,
  updateTaskStatus,
  deleteTask,
  dashboardSummary,
};
