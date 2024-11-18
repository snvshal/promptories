"use server"

import { revalidatePath } from "next/cache"
import { AIChat } from "@/models/ai-chat.model"
import { connectToDatabase } from "@/utils/db"
import { currentUser } from "@/utils/get-user"
import { AIChatFormValue } from "@/components/ai-chat/create"

export async function saveAIChat(data: AIChatFormValue) {
  try {
    await connectToDatabase()

    const { status, FormValues } = await validateAIChatFormData(data)

    if (status) await AIChat.create(FormValues)

    revalidatePath("/ai-chats")
  } catch (error) {
    console.error(error)
  }
}

export async function deleteAIChat(id: string) {
  try {
    await connectToDatabase()

    const user = await currentUser()
    if (!user) throw new Error("User not found!")

    const deletedChat = await AIChat.findOneAndDelete({
      _id: id,
      user: user._id,
    })

    if (!deletedChat) {
      throw new Error(
        "AI Chat not found or you do not have permission to delete it.",
      )
    }

    revalidatePath("/ai-chats")
    return { message: "AI Chat deleted successfully." }
  } catch (error) {
    console.error(error)
  }
}

export async function validateAIChatFormData(data: AIChatFormValue) {
  try {
    const user = await currentUser()

    if (!user) throw new Error("User not found!")

    const { title, description, model, chat_link } = data

    if (!title || title.length < 2 || title.length > 50) {
      throw new Error("Title must be between 2 and 40 characters.")
    }

    if (!description || description.length < 25 || description.length > 240) {
      throw new Error("Description must be between 25 and 240 characters.")
    }

    if (!model || model.length < 2 || model.length > 25) {
      throw new Error("Model must be between 2 and 20 characters.")
    }

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

    const FormValues = {
      user: user._id,
      title,
      description,
      model,
      chat_link,
      likes: [],
      replies: [],
    }

    return { status: true, FormValues }
  } catch (error) {
    console.error(error)
    return { status: false, FormValues: null }
  }
}

export const isValidURL = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
