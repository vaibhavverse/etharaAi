import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import * as projectService from "../services/project.service.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body, req.user._id);
  return res.status(201).json(new ApiResponse(201, project, "Project created successfully"));
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getProjects(req.user._id);
  return res.status(200).json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id, req.user._id);
  return res.status(200).json(new ApiResponse(200, project, "Project fetched successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body, req.user._id);
  return res.status(200).json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.id, req.user._id);
  return res.status(200).json(new ApiResponse(200, {}, "Project deleted successfully"));
});

export const addMember = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const project = await projectService.addMemberByEmail(req.params.id, email, req.user._id);
  return res.status(200).json(new ApiResponse(200, project, "Member added successfully"));
});

export const removeMember = asyncHandler(async (req, res) => {
  const { memberId } = req.body;
  if (!memberId) throw new ApiError(400, "Member ID is required");

  const project = await projectService.removeMember(req.params.id, memberId, req.user._id);
  return res.status(200).json(new ApiResponse(200, project, "Member removed successfully"));
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all projects where the user is either the owner or a member
  const projects = await Project.find({
    $or: [{ ownerId: userId }, { "members.user": userId }],
  });

  const adminProjectIds = [];
  const memberProjectIds = [];

  projects.forEach((p) => {
    const memberRecord = p.members.find((m) => m.user.toString() === userId.toString());
    const isOwner = p.ownerId.toString() === userId.toString();
    
    if (isOwner || memberRecord?.role === "admin") {
      adminProjectIds.push(p._id);
    } else if (memberRecord?.role === "member") {
      memberProjectIds.push(p._id);
    }
  });

  // Define task query based on project-scoped roles
  // Admins see all tasks in their projects, members only see assigned tasks
  const taskQuery = {
    $or: [
      { projectId: { $in: adminProjectIds } },
      { projectId: { $in: memberProjectIds }, assigneeId: userId },
    ],
  };

  const allTasks = await Task.find(taskQuery)
    .populate("assigneeId", "name email avatarUrl")
    .populate("projectId", "title");

  const now = new Date();

  const stats = {
    totalProjects: projects.length,
    totalTasks: allTasks.length,
    tasksByStatus: {
      todo: allTasks.filter((t) => t.status === "todo").length,
      "in-progress": allTasks.filter((t) => t.status === "in-progress").length,
      done: allTasks.filter((t) => t.status === "done").length,
    },
    overdueTasks: allTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done"
    ).length,
    recentTasks: allTasks
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5),
  };

  return res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

