import { TPost } from "@/types/schema.type";
import { Schema, model, models } from "mongoose";

const postSchema = new Schema<TPost>({
    user: {
        type: Schema.Types.ObjectId, // Reference to the user model
        ref: "User",
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    model: {
        type: String, // e.g., GPT-4, MidJourney, etc.
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    response: {
        type: String, // Storing text response or image URL if image type
        required: true,
    },
    response_type: {
        type: String, // Enum to ensure limited response types
        enum: ["text", "image", "video", "audio"],
        required: true,
    },
    replies: [
        {
            user: { type: Schema.Types.ObjectId, ref: "User" },
            reply: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    likes_count: {
        type: Number,
        default: 0,
    },
    bookmarks: [
        {
            type: Schema.Types.ObjectId, // Users who bookmarked the post
            ref: "User",
        },
    ],
    tags: [
        {
            type: String,
        },
    ],
    views_count: {
        // Added to track views
        type: Number,
        default: 0,
    },
    explanations: {
        // User explanation about prompting strategies
        type: String,
    },
    timestamps: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
    },
});

export const Post = models.Post || model("Post", postSchema);
