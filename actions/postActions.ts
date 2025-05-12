"use server"

import { connectToDatabase } from "@/utils/db"
import { Post } from "@/models/post.model"
import { currentUser } from "@/utils/get-user"
import { likeNotification } from "./notificationActions"
import { revalidatePath } from "next/cache"

export async function handleLikePost(postId: string) {
  try {
    await connectToDatabase()

    const post = await Post.findById(postId).populate("user")
    if (!post) throw new Error("Post not found!")

    const user = await currentUser()

    const isLiked = post.likes.includes(user?._id)

    if (isLiked) {
      post.likes.pull(user?._id)
    } else {
      post.likes.push(user?._id)
      await likeNotification(post)
    }

    await post.save({ validateModifiedOnly: true })

    revalidatePath("/home")
  } catch (error) {
    console.error("Error toggling like:", error)
  }
}

export async function handleBookmarkPost(postId: string) {
  try {
    await connectToDatabase()

    const post = await Post.findById(postId)
    if (!post) throw new Error("Post not found!")

    const user = await currentUser()

    const hasBookmarked = post.bookmarks.includes(user?._id)

    if (hasBookmarked) {
      post.bookmarks.pull(user?._id)
    } else {
      post.bookmarks.push(user?._id)
    }

    await post.save()

    revalidatePath("/home")
  } catch (error) {
    console.error("Error adding bookmarks:", error)
  }
}

export async function handleDeletePost(postId: string) {
  try {
    await connectToDatabase()

    const post = await Post.findById(postId)
    if (!post) throw new Error("Post not found!")

    const user = await currentUser()

    if (!post.user.equals(user?._id))
      throw new Error("Not authorized to delete this post.")

    await Post.findByIdAndDelete(post._id)

    // revalidatePath("/home")
  } catch (error) {
    console.error("Error deleting post:", error)
  }
}

export async function handlePostView(postId: string) {
  try {
    await connectToDatabase()

    const post = await Post.findById(postId)
    if (!post) throw new Error("Post not found!")

    const user = await currentUser()

    if (post.views.includes(user?._id)) return

    post.views.push(user)
    await post.save()

    revalidatePath("/home")
  } catch (error) {
    console.error("Error saving post view:", error)
  }
}
