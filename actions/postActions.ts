"use server"

import { connectToDatabase } from "@/utils/db"
import { Post } from "@/models/post.model"
import { currentUser } from "@/utils/get-user"
import { likeNotification } from "./notificationActions"
import { revalidatePath } from "next/cache"
import { Types } from "mongoose"

export async function handleLikePost(
  postId: string,
): Promise<{ success: boolean }> {
  try {
    await connectToDatabase()

    const post = await Post.findById(postId).populate("user")
    if (!post) throw new Error("Post not found!")

    const user = await currentUser()
    if (!user) throw new Error("User not found!")

    const isLiked = post.likes.includes(user?._id)

    if (isLiked) {
      post.likes.pull(user?._id)
      user.likes = (user.likes as Types.ObjectId[]).filter(
        (l) => !l.equals(post._id),
      )
    } else {
      post.likes.push(user?._id)
      user.likes.push(post._id)
      await likeNotification(post)
    }

    await post.save({ validateModifiedOnly: true })
    await user.save()

    return { success: true }
  } catch (error) {
    console.error("Error toggling like:", error)
    return { success: false }
  }
}

export async function handleBookmarkPost(
  postId: string,
): Promise<{ success: boolean }> {
  try {
    await connectToDatabase()

    const post = await Post.findById(postId)
    if (!post) throw new Error("Post not found!")

    const user = await currentUser()
    if (!user) throw new Error("User not found!")

    const hasBookmarked = post.bookmarks.includes(user?._id)

    if (hasBookmarked) {
      post.bookmarks.pull(user?._id)
      user.saved = (user.saved as Types.ObjectId[]).filter(
        (s) => !s.equals(post._id),
      )
    } else {
      post.bookmarks.push(user?._id)
      user.saved.push(post._id)
    }

    await post.save()
    await user.save()

    return { success: true }
  } catch (error) {
    console.error("Error adding bookmarks:", error)
    return { success: false }
  }
}

export async function handleDeletePost(
  postId: string,
): Promise<{ success: boolean }> {
  try {
    await connectToDatabase()

    const post = await Post.findById(postId)
    if (!post) throw new Error("Post not found!")

    const user = await currentUser()
    if (!user) throw new Error("User not found!")

    if (!post.user.equals(user?._id))
      throw new Error("Not authorized to delete this post.")

    await Post.findByIdAndDelete(post._id)

    user.posts = (user.posts as Types.ObjectId[]).filter(
      (postId) => !postId.equals(post._id),
    )
    await user.save()

    // revalidatePath("/home")
    return { success: true }
  } catch (error) {
    console.error("Error deleting post:", error)
    return { success: false }
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
