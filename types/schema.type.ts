import { Types, Document } from "mongoose";

export type TPost = Document & {
  promptory_id: number;
  user: Types.ObjectId | TUser;
  caption: string;
  model_url: string;
  chat_link?: string;
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
  social_links?: {
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

export type SessionUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  bio?: string;
  image?: string;
  social_links?: {
    twitter?: string;
    github?: string;
  };
  followers: string[];
  following: string[];
};

export type TNotification = Document & {
  type: "like" | "comment" | "follow" | "mention";
  user: Types.ObjectId | TUser;
  actor: Types.ObjectId | TUser;
  content: string;
  location: string;
  read: boolean;
};
