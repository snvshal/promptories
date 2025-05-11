import { Schema, model, models } from "mongoose"
import { promptory_types } from "@/lib/constants"
import { TPost, PRMedia, PRContent } from "@/types/schema.type"

const PRMediaSchema = new Schema<PRMedia>({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
})

const PRContentSchema = new Schema<PRContent>({
  text: { type: String, trim: true },
  media: { type: PRMediaSchema },
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
      trim: true,
    },
    model_url: {
      type: String,
      trim: true,
    },
    chat_link: {
      type: String,
      trim: true,
    },
    prompt: {
      type: PRContentSchema,
    },
    response: {
      type: PRContentSchema,
    },
    promptory_type: {
      type: String,
      enum: promptory_types,
      required: true,
    },
    replies: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true, trim: true },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        timestamp: { type: Date, default: Date.now },
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String, trim: true }],
    views: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
)

export const Post = models.Post || model<TPost>("Post", PostSchema)
