import { AIChatPT } from "@/types/generics.type"
import { connectToDatabase } from "./db"
import { AIChat } from "@/models/ai-chat.model"

export const getAIChats = async () => {
  try {
    await connectToDatabase()

    const aiChats: AIChatPT[] = await AIChat.find()
      .populate("user")
      .sort({ createdAt: -1 })
    return aiChats
  } catch (error) {
    console.error(error)
  }
}
