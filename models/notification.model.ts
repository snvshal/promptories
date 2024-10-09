import { Schema, models, model } from "mongoose";
import { TNotification } from "@/types/schema.type";

const notificationSchema = new Schema<TNotification>(
  {
    type: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Notification =
  models.Notification ||
  model<TNotification>("Notification", notificationSchema);
