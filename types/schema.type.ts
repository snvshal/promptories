import { Types } from "mongoose";

export type TPost = {
    user: Types.ObjectId;
    caption: string;
    model: string;
    prompt: string;
    response: string;
    response_type: "text" | "image" | "video" | "audio";
    replies: {
        user: Types.ObjectId;
        reply: string;
        timestamp: Date;
    }[];
    likes_count: number;
    bookmarks: Types.ObjectId[];
    tags: string[];
    views_count: number;
    explanations?: string;
    timestamps: { createdAt: Date; updatedAt: Date };
};

export type TUser = {
    email: string;
    name: string;
    image: string;
};
