"use server";

import { connectToDatabase } from "@/utils/db";
import { Post } from "@/models/post.model";
import { Types } from "mongoose";
import { currentUser } from "@/utils/get-user";

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

export async function handleDeletePost(postId: string) {
  try {
    await connectToDatabase();

    const user = await currentUser();

    if (!user) {
      throw new Error("User not found");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found!");
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== user._id?.toString()) {
      throw new Error("Not authorized to delete this post.");
    }

    // await post.remove(); // Delete the post
    await Post.findByIdAndDelete(post._id);

    console.log("Post deleted successfully!");
    // return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete the post.");
  }
}
