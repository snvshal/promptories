import mongoose from "mongoose"
import { Post } from "@/models/post.model"
import { posts, users } from "./data"
import { connectToDatabase } from "@/utils/db"
import { User } from "@/models/user.model"

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
