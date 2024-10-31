import { Post } from "@/models/post.model"
import { connectToDatabase } from "./db"
import { PRMedia, TPost, TUser } from "@/types/schema.type"
import { User } from "@/models/user.model"
import { seedPostDatabase } from "@/lib/seed"

export const getPosts = async () => {
  try {
    await connectToDatabase()
    // await seedPostDatabase();

    const posts: TPost[] = await Post.find({})
      .populate("user")
      .sort({ createdAt: -1 })

    return posts as TPost[]
  } catch (error) {
    console.log(error)
  }
}

export const getPostsByUsername = async (username: string) => {
  try {
    await connectToDatabase()
    const user = await User.findOne({ username })

    const posts: TPost[] = await Post.find({ user }).populate("user")

    return posts as TPost[]
  } catch (error) {
    console.log(error)
  }
}

export const getPostById = async (postId: string) => {
  try {
    await connectToDatabase()

    const post = await Post.findById(postId)
      .populate("user")
      .populate("replies.user")

    if (!post) return null

    return post as TPost
  } catch (error) {
    console.log(error)
  }
}

export const getLikedPosts = async (profileUser: TUser) => {
  try {
    await connectToDatabase()

    const likedPosts = await Post.find({ likes: profileUser._id }).populate(
      "user",
    )

    return likedPosts as TPost[]
  } catch (error) {
    console.log(error)
  }
}

export const getBookmarkedPosts = async (profileUser: TUser) => {
  try {
    await connectToDatabase()

    const bookmarkedPosts = await Post.find({
      bookmarks: profileUser._id,
    }).populate("user")

    return bookmarkedPosts as TPost[]
  } catch (error) {
    console.log(error)
  }
}

export const updatePostValues = (post: TPost) => {
  return {
    caption: post.caption,
    model_url: post.model_url,
    chat_link: post.chat_link,
    prompt: post.prompt.text as string,
    prompt_media: post.prompt.media as PRMedia,
    response: post.response.text as string,
    response_media: post.response.media as PRMedia,
    promptory_type: post.promptory_type,
    tags: post.tags.join(),
  }
}
