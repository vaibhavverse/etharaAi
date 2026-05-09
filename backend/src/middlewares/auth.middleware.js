import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Project } from "../models/project.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Extract token
  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify token
    const decodedToken = jwt.verify(token, config.jwtSecret);

    // Find user
    const user = await User.findById(decodedToken._id).select("-passwordHash");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or Expired Access Token");
  }
});

export const authorizeProjectRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    const projectId = req.params.id || req.params.projectId || req.body.projectId;

    if (!projectId) {
      throw new ApiError(400, "Project ID is required for authorization");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Check if user is the owner (Legacy support) or has the required role in members array
    const isOwner = project.ownerId.toString() === req.user._id.toString();
    const memberRecord = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    const userRole = isOwner ? "admin" : memberRecord?.role;

    if (!userRole || !roles.includes(userRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action in this project"
      );
    }

    // Attach project and user role to request for later use
    req.project = project;
    req.projectRole = userRole;

    next();
  });
};