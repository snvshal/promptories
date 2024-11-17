import { Schema, models, model } from "mongoose"
import { TAIChat } from "@/types/schema.type"

const aiChatSchema = new Schema<TAIChat>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    chat_link: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
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
