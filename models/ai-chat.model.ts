import { Schema, models, model } from "mongoose"
import { TAIChat } from "@/types/schema.type"

const aiChatSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    chat_link: {
      type: String,
      required: true,
      trim: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true, trim: true },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

export const AIChat = models.AIChat || model<TAIChat>("AIChat", aiChatSchema)
