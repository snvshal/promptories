import { Types, Document } from "mongoose"

export type TPost = Document & {
  user: Types.ObjectId | TUser
  caption: string
  model_url: string
  chat_link?: string
  prompt: PRContent
  response: PRContent
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
  password?: string
  bio?: string
  avatar?: string
  external_link?: string
  posts: (Types.ObjectId | TPost)[]
  likes: (Types.ObjectId | TPost)[]
  saved: (Types.ObjectId | TPost)[]
  blocked: (Types.ObjectId | TUser)[]
  muted: (Types.ObjectId | TUser)[]
  followers: (Types.ObjectId | TUser)[]
  following: (Types.ObjectId | TUser)[]
}

export type PRContent = {
  text?: string
  media?: PRMedia
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
  content: string
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
  external_link?: string
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

// AI Chats Model Type
export type TAIChat = Document & {
  user: Types.ObjectId | TUser
  title: string
  description: string
  model_name: string
  chat_link: string
  likes: Types.ObjectId[]
  replies: TReplies[]
  createdAt?: Date
  updatedAt?: Date
}
