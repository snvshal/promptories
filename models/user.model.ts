import { Schema, model, models } from "mongoose";
import { TUser } from "@/types/schema.type";

const UserSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    socialLinks: {
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

export const User = models.User || model<TUser>("User", UserSchema);
