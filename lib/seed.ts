import mongoose from "mongoose"
import { Post } from "@/models/post.model"
import { aiChatData, posts, users } from "./data"
import { connectToDatabase } from "@/utils/db"
import { User } from "@/models/user.model"
import { AIChat } from "@/models/ai-chat.model"

export const seedPostDatabase = async () => {
  try {
    await connectToDatabase()
    // await Post.deleteMany();
    await Post.insertMany(posts)
    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database", error)
  } finally {
    mongoose.disconnect()
  }
}

export const seedUserDatabase = async () => {
  try {
    await connectToDatabase()
    await User.insertMany(users)
    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database", error)
  } finally {
    mongoose.disconnect()
  }
}

export const seedAIChatDatabase = async () => {
  try {
    await connectToDatabase()
    await AIChat.insertMany(aiChatData)
    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database", error)
  } finally {
    mongoose.disconnect()
  }
}
