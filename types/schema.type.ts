import { Types, Document } from "mongoose";

export type TPost = Document & {
  promptory_id: number;
  user: Types.ObjectId | TUser;
  caption: string;
  model: string;
  prompt: string;
  response: string;
  promptory_type: PromptoryType;
  replies: TReplies[];
  likes: Types.ObjectId[];
  bookmarks: Types.ObjectId[];
  tags: string[];
  views: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUser = Document & {
  username: string;
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
  };
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
};

// Define a base type for media types
export type MediaType = "text" | "image" | "video" | "audio";

// Combine all conversion types into a single type
export type PromptoryType = `${MediaType}-to-${MediaType}`;

// Post Replies Type
export type TReplies = Document & {
  user: Types.ObjectId | TUser;
  reply: string;
  likes: (Types.ObjectId | TUser)[];
  timestamp: Date;
};
