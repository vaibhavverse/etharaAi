import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as taskService from "../services/task.service.js";

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user);
  return res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

export const getTasksByProject = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasksByProject(req.params.projectId, req.user);
  return res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user);
  return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user);
  return res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
});
