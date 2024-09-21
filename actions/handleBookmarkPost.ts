"use server";

import { Post } from "@/models/post.model";
import { connectToDatabase } from "@/utils/db";
import { Types } from "mongoose";

// Function to handle bookmark/unbookmark for a post
export async function handleBookmarkPost(postId: string, userId: string) {
  try {
    await connectToDatabase();

    // Validate ObjectIds
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid post or user ID!");
    }

    const userObjectId = new Types.ObjectId(userId);

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found!");
    }

    // Check if the user has already bookmarked the post
    const hasBookmarked = post.bookmarks.includes(userObjectId);

    if (hasBookmarked) {
      // If already bookmarked, remove the user from bookmarks (unbookmark)
      post.bookmarks.pull(userObjectId);
    } else {
      // If not bookmarked, add the user to bookmarks
      post.bookmarks.push(userObjectId);
    }

    // Save the post with the updated bookmarks
    await post.save();

    // Return the updated number of bookmarks for the UI
    // return post.bookmarks.length;
  } catch (error) {
    console.error("Error adding bookmarks:", error);
    throw new Error("Failed to add bookmarks.");
  }
}
