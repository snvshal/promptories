"use server";

import { Post } from "@/models/post.model";
import { Types } from "mongoose";

// Function to handle like/unlike for a post
export async function handleLikePost(postId: string, userId: string) {
  console.log(`User ${userId} liked post ${postId}`);

  // Check if postId and userId are valid ObjectIds
  if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid post or user ID");
  }

  // Fetch the post from the database
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  // Check if the user has already liked the post
  const hasLiked = post.likes.includes(userId);

  if (hasLiked) {
    // If liked, remove the user from likes (unlike)
    post.likes = post.likes.filter(
      (id: Types.ObjectId) => id.toString() !== userId,
    );
    console.log(`User ${userId} unliked post ${postId}`);
  } else {
    // If not liked, add the user to likes (like)
    post.likes.push(userId);
    console.log(`User ${userId} liked post ${postId}`);
  }

  // Save the updated post back to the database
  await post.save();

  // Return the updated likes count or array if needed for UI updates
  return post.likes.length;
}
