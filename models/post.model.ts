import { Schema, model, models } from "mongoose"
import { promptory_types } from "@/lib/constants"
import { TPost, PRMedia } from "@/types/schema.type"

const PRMediaSchema = new Schema<PRMedia>({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
})

const PostSchema = new Schema<TPost>(
  {
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
    prompt_media: {
      type: PRMediaSchema,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    response_media: {
      type: PRMediaSchema,
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
        reply: { type: String, required: true },
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
)

export const Post = models.Post || model<TPost>("Post", PostSchema)
