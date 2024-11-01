"use server"

import { connectToDatabase } from "@/utils/db"
import { Post } from "@/models/post.model"
import { currentUser } from "@/utils/get-user"
import { parseTags, ps } from "@/utils/ps"
import { FormValues } from "@/components/form"

export async function savePostForm(data: FormValues) {
  try {
    await connectToDatabase()
    const user = await currentUser()

    const post = await Post.create({
      user: user,
      caption: data.caption,
      model_url: data.model_url,
      chat_link: data.chat_link,
      prompt: { text: data.prompt, media: data.prompt_media },
      response: { text: data.response, media: data.response_media },
      promptory_type: data.promptory_type,
      tags: parseTags(data.tags as string),
    })

    return ps(post)
  } catch (error) {
    console.error("Error saving post:", error)
  }
}

export async function updatePostForm(data: FormValues, postId: string) {
  try {
    await connectToDatabase()

    const post = await Post.findById(postId)
    if (!post) throw new Error("Post not found!")

    const user = await currentUser()

    if (!post.user.equals(user?._id))
      throw new Error("Not authorized to delete this post.")

    post.caption = data.caption
    post.model_url = data.model_url
    post.chat_link = data.chat_link
    post.prompt = { text: data.prompt, media: data.prompt_media }
    post.response = { text: data.response, media: data.response_media }
    post.promptory_type = data.promptory_type
    post.tags = parseTags(data.tags as string)

    // Save the updated post
    await post.save()
  } catch (error) {
    console.error("Error saving post:", error)
  }
}
