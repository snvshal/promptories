"use server";

import { Post } from "@/models/post.model";
import { connectToDatabase } from "@/utils/db";
import { currentUser } from "@/utils/get-user";
import { ps } from "@/utils/ps";
import { Types } from "mongoose";

export async function handleLikeReply(postId: string, replyId: string) {
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

    const reply = post.replies.id(replyId);
    if (!reply) {
      throw new Error("Reply not found!");
    }

    // Toggle like
    if (reply.likes.includes(user._id)) {
      reply.likes.pull(user._id);
    } else {
      reply.likes.push(user._id);
    }

    await post.save();

    return ps(reply.likes as Types.ObjectId[]);
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Failed to like/unlike the reply.");
  }
}
