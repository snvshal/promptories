"use server";

import { connectToDatabase } from "@/utils/db";
import { Post } from "@/models/post.model";
import { Types } from "mongoose";

// Server action to like or unlike a post
export async function handleLikePost(postId: string, userId: string) {
  try {
    await connectToDatabase();

    // Check if postId and userId are valid ObjectIds
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid post or user ID!");
    }

    const userObjectId = new Types.ObjectId(userId);

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found!");
    }

    const isLiked = post.likes.includes(userObjectId);

    // If already liked, remove the like; otherwise, add it
    if (isLiked) {
      post.likes.pull(userObjectId);
    } else {
      post.likes.push(userObjectId);
    }

    // Save the post without validating the replies array
    await post.save({ validateModifiedOnly: true });

    // return post;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Failed to like/unlike the post.");
  }
}
