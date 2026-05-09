import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getDashboardStats,
} from "../controllers/project.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validation/project.validation.js";
import { verifyJWT, authorizeProjectRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/dashboard/stats", getDashboardStats);

router
  .route("/")
  .post(validate(createProjectSchema), createProject)
  .get(getProjects);

router
  .route("/:id")
  .get(authorizeProjectRole("admin", "member"), getProjectById)
  .patch(authorizeProjectRole("admin"), validate(updateProjectSchema), updateProject)
  .delete(authorizeProjectRole("admin"), deleteProject);

router.post("/:id/members/add", authorizeProjectRole("admin"), addMember);
router.post("/:id/members/remove", authorizeProjectRole("admin"), removeMember);

export default router;
