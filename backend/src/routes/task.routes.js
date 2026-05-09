import { Router } from "express";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../validation/task.validation.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(validate(createTaskSchema), createTask);
router.route("/project/:projectId").get(getTasksByProject);

router
  .route("/:id")
  .patch(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;
