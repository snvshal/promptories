import AIChatsComponent from "@/components/ai-chat"
// import { seedAIChatDatabase } from "@/lib/seed"
import { AIChat } from "@/models/ai-chat.model"
import { TAIChat } from "@/types/schema.type"
import { connectToDatabase } from "@/utils/db"
import { ps } from "@/utils/ps"
import { Types } from "mongoose"

type Populate<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: Exclude<T[P], Types.ObjectId>
}

export type TAIChatPopulated = Populate<TAIChat, "user">

export default async function AIChatsPage() {
  await connectToDatabase()

  //   await seedAIChatDatabase()
  const aiChats: TAIChatPopulated[] = await AIChat.find()
    .populate("user")
    .sort({ createdAt: -1 })
  return <AIChatsComponent aiChats={ps(aiChats)} />
}
