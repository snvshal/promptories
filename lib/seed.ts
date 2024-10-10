import mongoose from "mongoose";
import { Post } from "@/models/post.model"; // Import your Post model
import { posts } from "./data"; // Import the posts array
import { connectToDatabase } from "@/utils/db";

export const seedDatabase = async () => {
  try {
    await connectToDatabase();
    await Post.deleteMany(); // Clear existing posts
    await Post.insertMany(posts); // Insert seed posts
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database", error);
  } finally {
    mongoose.disconnect();
  }
};
