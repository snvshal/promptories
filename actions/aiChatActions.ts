"use server"

import { revalidatePath } from "next/cache"
import { AIChat } from "@/models/ai-chat.model"
import { connectToDatabase } from "@/utils/db"
import { currentUser } from "@/utils/get-user"
import { AIChatFormValue } from "@/components/ai-chat/create"

export async function saveAIChat(data: AIChatFormValue) {
  try {
    await connectToDatabase()

    const user = await currentUser()

    if (!user) throw new Error("User not found!")

    const { title, description, model, chat_link } = data

    // Validate title
    if (!title || title.length < 2 || title.length > 50) {
      throw new Error("Title must be between 2 and 40 characters.")
    }

    // Validate description
    if (!description || description.length < 25 || description.length > 240) {
      throw new Error("Description must be between 25 and 240 characters.")
    }

    // Validate model
    if (!model || model.length < 2 || model.length > 25) {
      throw new Error("Model must be between 2 and 20 characters.")
    }

    // Validate chat_link
    if (
      !chat_link ||
      chat_link.length < 4 ||
      chat_link.length > 200 ||
      !isValidURL(chat_link)
    ) {
      throw new Error(
        "Chat link must be a valid URL between 4 and 200 characters.",
      )
    }
    await AIChat.create({
      user: user._id,
      title,
      description,
      model,
      chat_link,
      likes: [],
      replies: [],
    })

    revalidatePath("/ai-chats")
  } catch (error) {
    console.error(error)
  }
}

// Helper function to validate URL
function isValidURL(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
