import { Post } from "@/models/post.model"
import { connectToDatabase } from "./db"
import { PRMedia, TPost, TUser } from "@/types/schema.type"
import { User } from "@/models/user.model"
import { seedPostDatabase } from "@/lib/seed"
import { FormValues } from "@/components/form"

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
  const prompt = post.promptory_type.toLowerCase().startsWith("text")
    ? (post.prompt.text as string)
    : ""
  const prompt_media = post.promptory_type.toLowerCase().startsWith("text")
    ? ""
    : (post.prompt.media as PRMedia)
  const response = post.promptory_type.toLowerCase().endsWith("text")
    ? (post.response.text as string)
    : ""
  const response_media = post.promptory_type.toLowerCase().endsWith("text")
    ? ""
    : (post.response.media as PRMedia)
  return {
    postValues: {
      caption: post.caption,
      model_url: post.model_url,
      chat_link: post.chat_link,
      prompt,
      response,
      promptory_type: post.promptory_type,
      tags: post.tags.join(" "),
    } as FormValues,
    editPostMedia: {
      prompt: prompt_media,
      response: response_media,
    } as { prompt: PRMedia; response: PRMedia },
  }
}

export async function getPostMediaById(
  id: string,
  prompt_response: "response" | "prompt",
) {
  try {
    await connectToDatabase()

    const post = await Post.findById(id).select(`${prompt_response}.media.url`)

    if (!post || !post[prompt_response]?.media) {
      return null
    }

    return post[prompt_response].media
  } catch (error) {
    console.error("Error fetching post media:", error)
    return null
  }
}
