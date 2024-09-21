"use server";

import { connectToDatabase } from "@/utils/db"; // Make sure you have a DB connection utility
import { Post } from "@/models/post.model";
import { currentUser } from "@/utils/get-user";
import { ps } from "@/utils/ps";
import { Types } from "mongoose";

// Server action to add a reply to a post
export async function addReplyToPost(postId: string, replyText: string) {
  try {
    // Connect to the database
    await connectToDatabase();

    if (!Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID!");
    }

    const user = await currentUser();

    // Find the post by ID and push the reply to the replies array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          replies: {
            user: user,
            reply: replyText,
            timestamp: new Date(),
          },
        },
      },
      { new: true }, // Return the updated post
    ).populate("replies.user"); // Populate the 'user' field in replies

    return ps(updatedPost);
  } catch (error) {
    console.error("Error adding reply:", error);
    throw new Error("Failed to add reply.");
  }
}
