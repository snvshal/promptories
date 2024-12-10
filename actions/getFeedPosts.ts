"use server"

import { Post } from "@/models/post.model"
import { TPost } from "@/types/schema.type"
import { connectToDatabase } from "@/utils/db"
import { getPosts } from "@/utils/get-posts"
import { currentUser } from "@/utils/get-user"

export async function getFollowingPosts() {
  try {
    await connectToDatabase()
    const user = await currentUser()

    if (!user) {
      console.error("No current user found.")
      return [] as TPost[]
    }

    if (!user.following || user.following.length === 0) {
      return [] as TPost[]
    }

    const posts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate("user")
      .lean()

    return posts as unknown as TPost[]
  } catch (error) {
    console.error("Error fetching posts from following:", error)
    return [] as TPost[]
  }
}

export async function fetchFeedPosts(feedType: string) {
  return feedType === "following" ? getFollowingPosts() : getPosts()
}
