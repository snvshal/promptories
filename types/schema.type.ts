import { Types } from "mongoose";

export type TPost = {
  promptory_id: number;
  user: Types.ObjectId;
  caption: string;
  model: string;
  prompt: string;
  response: string;
  promptory_type: PromptoryType;
  replies: {
    user: Types.ObjectId;
    reply: string;
    timestamp: Date;
  }[];
  likes_count: number;
  bookmarks: Types.ObjectId[];
  tags: string[];
  views_count: number;
};

export type TUser = Document & {
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
};

// Define a base type for media types
export type MediaType = "text" | "image" | "video" | "audio";

// Combine all conversion types into a single type
export type PromptoryType = `${MediaType}-to-${MediaType}`;
