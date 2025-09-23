import { Schema, model, models, Types } from "mongoose"
import { TUser } from "@/types/schema.type"

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
    password: {
      type: String,
      minlength: 8,
      validate: {
        validator: (value: string) =>
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value),
        message:
          "Password must be at least 8 characters and contain letters & numbers",
      },
    },

    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    external_link: {
      type: String,
      default: "",
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    saved: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    blocked: [{ type: Schema.Types.ObjectId, ref: "User" }],
    muted: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
)

export const User = models.User || model<TUser>("User", UserSchema)
