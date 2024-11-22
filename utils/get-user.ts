import { getServerSession } from "next-auth"
import { connectToDatabase } from "./db"
import { User } from "@/models/user.model"
import { TUser } from "@/types/schema.type"

export const currentUser = async () => {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    const user = await User.findOne({ email: session?.user?.email })

    return user as TUser
  } catch (error) {
    console.error(error)
  }
}

export const getUserByUsername = async (username: string) => {
  try {
    await connectToDatabase()

    const user: TUser | null = await User.findOne({ username })

    return user as TUser
  } catch (error) {
    console.error(error)
  }
}
