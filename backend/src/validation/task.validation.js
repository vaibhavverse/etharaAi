import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    description: z.string().optional(),
    status: z.enum(["todo", "in-progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    dueDate: z.string().optional(),
    assigneeId: z.string().optional(),
    projectId: z.string({ required_error: "Project ID is required" }),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.enum(["todo", "in-progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    dueDate: z.string().optional(),
    assigneeId: z.string().optional(),
  }),
});
