import { Types, Document } from "mongoose"

export type TPost = Document & {
  user: Types.ObjectId | TUser
  caption: string
  model_url: string
  chat_link?: string
  prompt: string
  prompt_media: PRMedia
  response: string
  response_media: PRMedia
  promptory_type: PromptoryType
  replies: TReplies[]
  likes: Types.ObjectId[]
  bookmarks: Types.ObjectId[]
  tags: string[]
  views: Types.ObjectId[]
  createdAt?: Date
  updatedAt?: Date
}

export type TUser = Document & {
  username: string
  name: string
  email: string
  password: string
  bio?: string
  avatar?: string
  social_links?: {
    twitter?: string
    github?: string
  }
  posts: Types.ObjectId[]
  followers: Types.ObjectId[]
  following: Types.ObjectId[]
}

// Prompt or Response Media Type
export type PRMedia = {
  url: string
  type: "image" | "video"
}

// Define a base type for media types
export type PromptoryContentType = "text" | "image" | "video" | "audio"

// Combine all conversion types into a single type
export type PromptoryType = `${PromptoryContentType}-to-${PromptoryContentType}`

// Post Replies Type
export type TReplies = Document & {
  user: Types.ObjectId | TUser
  reply: string
  likes: (Types.ObjectId | TUser)[]
  timestamp: Date
}

export type SessionUser = {
  id: string
  username: string
  name: string
  email: string
  bio?: string
  image?: string
  social_links?: {
    twitter?: string
    github?: string
  }
  followers: string[]
  following: string[]
}

export type TNotification = Document & {
  type: "like" | "comment" | "follow" | "mention"
  user: Types.ObjectId | TUser
  actor: Types.ObjectId | TUser
  content: string
  location: string
  read: boolean
  createdAt?: Date
  updatedAt?: Date
}
