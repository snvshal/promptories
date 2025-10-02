import { getServerSession } from "next-auth"
import { connectToDatabase } from "./db"
import { User } from "@/models/user.model"
import { TUser } from "@/types/schema.type"
import { ContextUser } from "@/hooks/use-user"
import { ps } from "./ps"
import { MUser } from "@/components/settings/privacy-and-safety"

export const currentUser = async (): Promise<TUser | null> => {
  try {
    await connectToDatabase()
    const session = await getServerSession()

    const user = await User.findOne({ email: session?.user?.email })

    return user as TUser
  } catch (error) {
    return null
  }
}

export const getContextUser = async (): Promise<ContextUser | null> => {
  try {
    const user = await currentUser()
    if (!user) return null

    const contextUser: ContextUser = {
      id: user.id.toString(),
      username: user.username,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      external_link: user.external_link,
      posts: user.posts.map((p) => p.toString()),
      likes: user.likes.map((l) => l.toString()),
      saved: user.saved.map((s) => s.toString()),
      blocked: user.blocked.map((b) => b.toString()),
      muted: user.muted.map((m) => m.toString()),
      followers: user.followers.map((f) => f.toString()),
      following: user.following.map((f) => f.toString()),
    }

    return ps(contextUser)
  } catch (error) {
    console.error("getContextUser failed:", error)
    return null
  }
}

export const getUserByUsername = async (
  username: string,
): Promise<TUser | null> => {
  try {
    await connectToDatabase()

    const user = await User.findOne({ username }).populate([
      {
        path: "posts",
        populate: { path: "user" },
        options: { sort: { createdAt: -1 } },
      },
      {
        path: "likes",
        populate: { path: "user" },
      },
      {
        path: "saved",
        populate: { path: "user" },
      },
    ])

    user.likes = user.likes.reverse()
    user.saved = user.saved.reverse()

    return user as TUser
  } catch (error) {
    return null
  }
}

export const getMutedAndBlockedUsers = async (): Promise<{
  muted: MUser[]
  blocked: MUser[]
} | null> => {
  try {
    await connectToDatabase()

    const authUser = await currentUser()
    if (!authUser) return null

    const dbUser: TUser = await User.findById(authUser.id)
      .populate("muted")
      .populate("blocked")

    if (!dbUser) return null

    return {
      muted: dbUser.muted
        .filter((u): u is TUser => typeof u !== "string" && "_id" in u)
        .map((u: TUser) => ({
          id: u._id?.toString() as string,
          name: u.name,
          username: u.username,
          avatar: u.avatar,
        })),
      blocked: dbUser.blocked
        .filter((u): u is TUser => typeof u !== "string" && "_id" in u)
        .map((u: TUser) => ({
          id: u._id?.toString() as string,
          name: u.name,
          username: u.username,
          avatar: u.avatar,
        })),
    }
  } catch (error) {
    console.error("Error fetching muted/blocked users:", error)
    return null
  }
}
