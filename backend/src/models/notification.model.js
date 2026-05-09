import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["mention", "assigned", "overdue", "system"], required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, isRead: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);
