const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { ROLES } = require("../constants");

const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline } = req.body;

  const project = await Project.create({
    name,
    description,
    deadline,
    owner: req.user._id,
    members: [],
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully.",
    data: project,
  });
});

const listProjects = asyncHandler(async (req, res) => {
  const query =
    req.user.role === ROLES.ADMIN
      ? { owner: req.user._id }
      : { members: { $in: [req.user._id] } };

  const projects = await Project.find(query)
    .populate("owner", "name email role")
    .populate("members", "name email role")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: projects,
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  if (String(project.owner) !== String(req.user._id)) {
    throw new ApiError(403, "Only the owning admin can delete this project.");
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.json({
    success: true,
    message: "Project and related tasks deleted successfully.",
  });
});

const addMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { memberId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  if (String(project.owner) !== String(req.user._id)) {
    throw new ApiError(403, "Only the owning admin can manage project members.");
  }

  const member = await User.findById(memberId);
  if (!member) {
    throw new ApiError(404, "Member not found.");
  }

  if (!project.members.some((id) => String(id) === String(memberId))) {
    project.members.push(memberId);
    await project.save();
  }

  const populated = await project.populate("members", "name email role");

  res.json({
    success: true,
    message: "Member added to project.",
    data: populated,
  });
});

const removeMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { memberId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  if (String(project.owner) !== String(req.user._id)) {
    throw new ApiError(403, "Only the owning admin can manage project members.");
  }

  project.members = project.members.filter((id) => String(id) !== String(memberId));
  await project.save();

  await Task.deleteMany({ project: project._id, assignedTo: memberId });
  const populated = await project.populate("members", "name email role");

  res.json({
    success: true,
    message: "Member removed from project.",
    data: populated,
  });
});

module.exports = {
  createProject,
  listProjects,
  deleteProject,
  addMember,
  removeMember,
};
