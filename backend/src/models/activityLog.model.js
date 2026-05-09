import mongoose, { Schema } from "mongoose";

const activityLogSchema = new Schema(
  {
    action: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetEntityId: { type: Schema.Types.ObjectId, required: true },
    entityType: { type: String, enum: ["Task", "Project"], required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

activityLogSchema.index({ targetEntityId: 1, entityType: 1 });
activityLogSchema.index({ userId: 1 });

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
