import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createTask = async (taskData, user) => {
  const project = await Project.findById(taskData.projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const userRole = project.members.find(m => m.user.toString() === user._id.toString())?.role;
  const isOwnerOrAdmin = project.ownerId.toString() === user._id.toString() || userRole === "admin";
  
  if (!isOwnerOrAdmin) {
    throw new ApiError(403, "Only admins or project owners can create tasks");
  }

  const task = await Task.create(taskData);

  await ActivityLog.create({
    action: "Task Created",
    userId: user._id,
    targetEntityId: task._id,
    entityType: "Task",
    metadata: { title: task.title, status: task.status },
  });

  return task;
};

export const getTasksByProject = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const userRole = project.members.find(m => m.user.toString() === user._id.toString())?.role;
  const isOwnerOrAdmin = project.ownerId.toString() === user._id.toString() || userRole === "admin";

  let query = { projectId };
  if (!isOwnerOrAdmin && userRole === "member") {
    query.assigneeId = user._id;
  }

  return await Task.find(query)
    .sort({ order: 1, createdAt: -1 })
    .populate("assigneeId", "name email avatarUrl");
};

export const updateTask = async (taskId, updateData, user) => {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  const project = await Project.findById(task.projectId);
  const userRole = project?.members.find(m => m.user.toString() === user._id.toString())?.role;
  const isOwnerOrAdmin = project?.ownerId.toString() === user._id.toString() || userRole === "admin";

  // Enforce role-based update restriction: Members can only update tasks assigned to them
  if (!isOwnerOrAdmin && userRole === "member") {
    if (task.assigneeId?.toString() !== user._id.toString()) {
      throw new ApiError(403, "Members can only update tasks assigned to them");
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true, runValidators: true });

  await ActivityLog.create({
    action: "Task Updated",
    userId: user._id,
    targetEntityId: updatedTask._id,
    entityType: "Task",
    metadata: { title: updatedTask.title, status: updatedTask.status },
  });

  return updatedTask;
};

export const deleteTask = async (taskId, user) => {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  const project = await Project.findById(task.projectId);
  const userRole = project?.members.find(m => m.user.toString() === user._id.toString())?.role;
  const isOwnerOrAdmin = project?.ownerId.toString() === user._id.toString() || userRole === "admin";

  if (!isOwnerOrAdmin) {
    throw new ApiError(403, "Only admins or project owners can delete tasks");
  }

  await Task.findByIdAndDelete(taskId);

  await ActivityLog.create({
    action: "Task Deleted",
    userId: user._id,
    targetEntityId: taskId,
    entityType: "Task",
    metadata: { title: task.title },
  });

  return task;
};
