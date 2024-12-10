import { Post } from "@/models/post.model"
import { connectToDatabase } from "./db"
import { PRMedia, TPost, TUser } from "@/types/schema.type"
import { User } from "@/models/user.model"
import { FormValues } from "@/components/form"
import { PostFormMedia } from "@/types/props.type"

export const getPosts = async () => {
  try {
    await connectToDatabase()

    const posts: TPost[] = await Post.find({})
      .populate("user")
      .sort({ createdAt: -1 })

    return posts as TPost[]
  } catch (error) {
    console.error("Error fetching posts:", error)
    return [] as TPost[]
  }
}

export const getPostsByUsername = async (username: string) => {
  try {
    await connectToDatabase()
    const user = await User.findOne({ username })

    if (!user) return [] as TPost[]

    const posts: TPost[] = await Post.find({ user })
      .populate("user")
      .sort({ createdAt: -1 })

    return posts as TPost[]
  } catch (error) {
    console.error("Error fetching posts by username:", error)
    return [] as TPost[]
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
    console.error("Error fetching post by ID:", error)
    return null
  }
}

export const getLikedPosts = async (profileUser: TUser) => {
  try {
    await connectToDatabase()

    const likedPosts = await Post.find({ likes: profileUser._id })
      .populate("user")
      .sort({ createdAt: -1 })

    return likedPosts as TPost[]
  } catch (error) {
    console.error("Error fetching liked posts:", error)
    return [] as TPost[]
  }
}

export const getBookmarkedPosts = async (profileUser: TUser) => {
  try {
    await connectToDatabase()

    const bookmarkedPosts = await Post.find({
      bookmarks: profileUser._id,
    })
      .populate("user")
      .sort({ createdAt: -1 })

    return bookmarkedPosts as TPost[]
  } catch (error) {
    console.error("Error fetching bookmarked posts:", error)
    return [] as TPost[]
  }
}

export const updatePostValues = (post: TPost) => {
  const isTextPrompt = post.promptory_type.toLowerCase().startsWith("text")
  const isTextResponse = post.promptory_type.toLowerCase().endsWith("text")

  return {
    postValues: {
      caption: post.caption,
      model_url: post.model_url,
      chat_link: post.chat_link,
      prompt: isTextPrompt ? (post.prompt.text as string) || "" : "",
      response: isTextResponse ? (post.response.text as string) || "" : "",
      promptory_type: post.promptory_type,
      tags: post.tags.join(" "),
    } as FormValues,
    editPostMedia: {
      prompt: isTextPrompt
        ? { type: "image", url: "" }
        : (post.prompt.media as PRMedia),
      response: isTextResponse
        ? { type: "image", url: "" }
        : (post.response.media as PRMedia),
    } as PostFormMedia,
  }
}
