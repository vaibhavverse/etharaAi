import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createProject = async (projectData, userId) => {
  const project = await Project.create({
    ...projectData,
    ownerId: userId,
    members: [{ user: userId, role: "admin" }],
  });

  await ActivityLog.create({
    action: "Project Created",
    userId,
    targetEntityId: project._id,
    entityType: "Project",
    metadata: { title: project.title },
  });

  return project;
};

export const getProjects = async (userId) => {
  return await Project.find({
    $or: [{ ownerId: userId }, { "members.user": userId }],
  })
    .populate("ownerId", "name email avatarUrl")
    .populate("members.user", "name email avatarUrl");
};

export const getProjectById = async (projectId, userId) => {
  const project = await Project.findById(projectId)
    .populate("ownerId", "name email avatarUrl")
    .populate("members.user", "name email avatarUrl");

  if (!project) throw new ApiError(404, "Project not found");

  const isMember = project.members.some(
    (m) => m.user._id.toString() === userId.toString()
  );

  if (project.ownerId._id.toString() !== userId.toString() && !isMember) {
    throw new ApiError(403, "Access denied");
  }

  return project;
};

export const updateProject = async (projectId, updateData, userId) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, ownerId: userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!project) throw new ApiError(404, "Project not found or access denied");

  return project;
};

export const deleteProject = async (projectId, userId) => {
  const project = await Project.findOneAndDelete({ _id: projectId, ownerId: userId });

  if (!project) throw new ApiError(404, "Project not found or access denied");

  return project;
};

export const addMemberByEmail = async (projectId, email, ownerId) => {
  const project = await Project.findOne({ _id: projectId, ownerId });
  if (!project) throw new ApiError(403, "Only project owner can add members");

  const userToAdd = await User.findOne({ email: email.toLowerCase() });
  if (!userToAdd) throw new ApiError(404, `No user found with email: ${email}`);

  const isAlreadyMember = project.members.some(
    (m) => m.user.toString() === userToAdd._id.toString()
  );

  if (project.ownerId.toString() === userToAdd._id.toString() || isAlreadyMember) {
    throw new ApiError(409, "User is already in this project");
  }

  project.members.push({ user: userToAdd._id, role: "member" });
  await project.save();

  return await Project.findById(projectId)
    .populate("ownerId", "name email avatarUrl")
    .populate("members.user", "name email avatarUrl");
};

export const removeMember = async (projectId, memberId, ownerId) => {
  const project = await Project.findOne({ _id: projectId, ownerId });
  if (!project) throw new ApiError(403, "Only project owner can remove members");

  project.members = project.members.filter(
    (m) => m.user.toString() !== memberId
  );
  await project.save();

  return await Project.findById(projectId)
    .populate("ownerId", "name email avatarUrl")
    .populate("members.user", "name email avatarUrl");
};
