"use server"

import { Post } from "@/models/post.model"
import { TPost } from "@/types/schema.type"
import { connectToDatabase } from "@/utils/db"
import { getPosts } from "@/utils/get-posts"
import { currentUser } from "@/utils/get-user"
import { ps } from "@/utils/ps"
import { cookies } from "next/headers"

export async function getFollowingPosts() {
  try {
    await connectToDatabase()
    const user = await currentUser()

    if (!user) {
      console.error("No current user found.")
      return [] as TPost[]
    }

    if (!user.following || user.following.length === 0) {
      const userPosts = await Post.find({
        user: user._id,
      })
        .sort({ createdAt: -1 })
        .populate("user")

      return userPosts as TPost[]
    }

    const posts = await Post.find({
      user: { $in: [...user.following, user._id] },
    })
      .sort({ createdAt: -1 })
      .populate("user")

    return posts as TPost[]
  } catch (error) {
    console.error("Error fetching posts from following:", error)
    return [] as TPost[]
  }
}

export async function fetchFeedPosts() {
  const cookieStore = await cookies()
  const feedType = cookieStore.get("feed_type")

  const forYou = await getPosts()
  const following = await getFollowingPosts()

  return ps({ feedType: feedType?.value, forYou, following })
}
