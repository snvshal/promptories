import { TUser } from "@/types/schema.type";
import { Schema, model, models } from "mongoose";

const userSchema = new Schema<TUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    image: { type: String },
});

export const User = models.User || model("User", userSchema);
