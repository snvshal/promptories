import { Schema, model, models } from "mongoose";
import { promptory_types } from "@/lib/constants";
import { TPost } from "@/types/schema.type";

const PostSchema = new Schema<TPost>(
  {
    promptory_id: {
      type: Number,
      required: true,
      unique: true,
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
    model_url: {
      type: String,
      required: true,
    },
    chat_link: {
      type: String,
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
        user: { type: Schema.Types.ObjectId, ref: "User" },
        reply: { type: String },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        timestamp: { type: Date, default: Date.now },
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
    views: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

// Export the Mongoose model
export const Post = models.Post || model<TPost>("Post", PostSchema);
