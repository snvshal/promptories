import { Schema, model, models } from "mongoose";
import { promptory_types } from "@/lib/constants";
import { TPost } from "@/types/schema.type";

const PostSchema: Schema = new Schema(
  {
    promptory_id: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    promptory_type: {
      type: String,
      enum: promptory_types,
      required: true,
    },
    replies: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reply: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    likes_count: {
      type: Number,
      default: 0,
    },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
    views_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Export the Mongoose model
export const Post = models.Post || model<TPost>("Post", PostSchema);
