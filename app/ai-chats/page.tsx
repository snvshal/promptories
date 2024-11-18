import AIChatsComponent from "@/components/ai-chat/component"
import { AIChat } from "@/models/ai-chat.model"
import { AIChatPT } from "@/types/generics.type"
import { connectToDatabase } from "@/utils/db"
import { ps } from "@/utils/ps"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Chats",
  description:
    "Explore user-shared conversations with popular AI models like ChatGPT, Claude, Gemini, and v0. Get inspired and learn from diverse examples on Promptories.",
  openGraph: {
    title: "AI Chats — Promptories",
    description:
      "Browse a collection of AI-driven chats shared by users, featuring models like ChatGPT, Claude, Gemini, and v0. Discover and learn from real conversations.",
    url: `${process.env.METADATA_BASE_URL}/ai-chats`,
    siteName: "Promptories",
    type: "website",
  },
  twitter: {
    title: "AI Chats — Promptories",
    description:
      "Discover user conversations with various AI models like ChatGPT, Claude, Gemini, and v0 on Promptories. Get inspired by real examples.",
    card: "summary",
  },
}

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

export default async function AIChatsPage() {
  const aiChats = await getAIChats()
  return <AIChatsComponent aiChats={ps(aiChats as AIChatPT[])} />
}
