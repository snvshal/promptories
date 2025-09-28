"use server"

import { connectToDatabase } from "@/utils/db"
import { Post } from "@/models/post.model"
import { currentUser } from "@/utils/get-user"
import { parseTags, ps } from "@/utils/ps"
import { FormValues } from "@/components/form"
import { revalidatePath } from "next/cache"
import { PromptoryType, TPost } from "@/types/schema.type"
import { Types } from "mongoose"

export async function savePostForm(
  data: FormValues,
): Promise<{ success: boolean; post?: TPost }> {
  try {
    await connectToDatabase()

    const user = await currentUser()
    if (!user) throw new Error("User not found.")

    const postData = {
      user: user,
      caption: data.caption || "",
      model_url: data.model_url || "",
      chat_link: data.chat_link || "",
      prompt: {
        text: data.prompt,
        media: data.prompt_media || null,
      },
      response: {
        text: data.response || "",
        media: data.response_media || null,
      },
      promptory_type: data.promptory_type,
      tags: parseTags(data.tags || ""),
    }

    const post: TPost = await Post.create(postData)
    if (!post) throw new Error("Failed to create post")

    user.posts.push(post)
    await user.save()

    revalidatePath("/home")
    return ps({ success: true, post })
  } catch (error) {
    console.error("Error saving post:", error)
    return { success: false }
  }
}

export async function updatePostForm(
  data: FormValues,
  postId: string,
): Promise<{ success: boolean; updatedPost?: TPost }> {
  try {
    await connectToDatabase()

    const post: TPost | null = await Post.findById(postId)
    if (!post) throw new Error("Post not found!")

    const user = await currentUser()
    if (!user) throw new Error("User not found.")

    if (!(post.user as Types.ObjectId).equals(user?._id as Types.ObjectId))
      throw new Error("Not authorized to delete this post.")

    const {
      promptory_type,
      prompt,
      response,
      caption,
      chat_link,
      model_url,
      prompt_media,
      response_media,
      tags,
    } = data

    if (post.caption !== caption) post.caption = caption as string
    if (post.model_url !== model_url) post.model_url = model_url as string
    if (post.chat_link !== chat_link) post.chat_link = chat_link
    if (post.promptory_type !== promptory_type)
      post.promptory_type = promptory_type as PromptoryType

    if (post.prompt.text !== prompt || post.prompt.media !== prompt_media)
      post.prompt = { text: prompt, media: prompt_media }

    if (
      post.response.text !== response ||
      post.response.media !== response_media
    )
      post.response = { text: response, media: response_media }

    post.tags = parseTags(tags as string)

    await post.save()

    revalidatePath("/home")
    return ps({ success: true, updatedPost: post })
  } catch (error) {
    console.error("Error saving post:", error)
    return { success: false }
  }
}
