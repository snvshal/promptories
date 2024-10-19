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
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    social_links: {
      twitter: { type: String, default: "", trim: true },
      github: { type: String, default: "", trim: true },
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

export const User = models.User || model<TUser>("User", UserSchema);
