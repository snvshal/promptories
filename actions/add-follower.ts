"use server"

import { User } from "@/models/user.model"
import { connectToDatabase } from "@/utils/db"
import { currentUser } from "@/utils/get-user"
import { Types } from "mongoose"
import { followNotification } from "./notification"
import { TUser } from "@/types/schema.type"
import { ps } from "@/utils/ps"

export async function addFollower(userId: string): Promise<{
  success: boolean
  status?: "Follow" | "Following"
  updatedFollowers?: Types.ObjectId[]
}> {
  try {
    await connectToDatabase()

    if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID!")

    const user = await currentUser()
    if (!user) throw new Error("Current user not found.")

    const profileUser: TUser | null = await User.findById(userId)
    if (!profileUser) throw new Error("Profile user not found.")

    const isFollowing = profileUser.followers.includes(
      user._id as Types.ObjectId,
    )

    if (!isFollowing) {
      // Add follower
      profileUser.followers.push(user._id as Types.ObjectId)
      user.following.push(profileUser._id as Types.ObjectId)

      // Follow notification
      await followNotification(profileUser)
    } else {
      // Remove follower
      profileUser.followers = profileUser.followers.filter((follower) => {
        if (follower instanceof Types.ObjectId) {
          return !follower.equals(user._id as Types.ObjectId)
        }
        // If follower is a user object, compare its _id
        return !(follower._id as Types.ObjectId).equals(
          user._id as Types.ObjectId,
        )
      })
      user.following = user.following.filter((following) => {
        if (following instanceof Types.ObjectId) {
          return !following.equals(profileUser._id as Types.ObjectId)
        }
        // If following is a user object, compare its _id
        return !(following._id as Types.ObjectId).equals(
          profileUser._id as Types.ObjectId,
        )
      })
    }

    await profileUser.save()
    await user.save()

    return ps({
      success: true,
      status: isFollowing ? "Follow" : "Following",
      updatedFollowers: profileUser.followers as Types.ObjectId[],
    })
  } catch (error) {
    console.error("Error adding follower:", error)
    return { success: false }
  }
}
