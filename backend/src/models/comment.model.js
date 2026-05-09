import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  },
  { timestamps: true }
);

commentSchema.index({ taskId: 1 });

export const Comment = mongoose.model("Comment", commentSchema);
