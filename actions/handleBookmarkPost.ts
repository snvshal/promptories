"use server";

import { Post } from "@/models/post.model";
import { Types } from "mongoose";

// Function to handle bookmark/unbookmark for a post
export async function handleBookmarkPost(postId: string, userId: string) {
  // Validate ObjectIds
  if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid post or user ID");
  }

  // Find the post by ID
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  // Check if the user has already bookmarked the post
  const hasBookmarked = post.bookmarks.includes(userId);

  if (hasBookmarked) {
    // If already bookmarked, remove the user from bookmarks (unbookmark)
    post.bookmarks = post.bookmarks.filter(
      (id: Types.ObjectId) => id.toString() !== userId,
    );
  } else {
    // If not bookmarked, add the user to bookmarks
    post.bookmarks.push(userId);
  }

  // Save the post with the updated bookmarks
  await post.save();

  // Return the updated number of bookmarks for the UI
  return post.bookmarks.length;
}
