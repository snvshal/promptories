"use server"

import { connectToDatabase } from "@/utils/db" // Make sure you have a DB connection utility
import { Post } from "@/models/post.model"
import { currentUser } from "@/utils/get-user"
import { ps } from "@/utils/ps"
import { Types } from "mongoose"
import { commentNotification } from "./notificationActions"

export async function addReplyToPost(postId: string, replyText: string) {
  try {
    await connectToDatabase()

    if (!Types.ObjectId.isValid(postId)) throw new Error("Invalid post ID!")

    if (!replyText) throw new Error("Reply is required!")

    const user = await currentUser()

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          replies: {
            user: user,
            reply: replyText.trim(),
            timestamp: new Date(),
          },
        },
      },
      { new: true },
    ).populate("replies.user")

    await commentNotification(updatedPost)

    return ps(updatedPost)
  } catch (error) {
    console.error("Error adding reply:", error)
    throw new Error("Failed to add reply.")
  }
}
