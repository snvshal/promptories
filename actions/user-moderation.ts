"use server"

import { revalidatePath } from "next/cache"
import { Types } from "mongoose"
import { connectToDatabase } from "@/utils/db"
import { currentUser } from "@/utils/get-user"
import { User } from "@/models/user.model"
import { TUser } from "@/types/schema.type"

export async function muteUser(targetUserId: string): Promise<{
  success: boolean
  message?: string
  error?: string
  status: "Muted" | "Unmuted" | null
}> {
  try {
    await connectToDatabase()
    const user = await currentUser()

    if (!user) {
      return { success: false, error: "Authentication required", status: null }
    }

    const userId = user._id?.toString()

    if (userId === targetUserId) {
      return { success: false, error: "Cannot mute yourself", status: null }
    }

    const currentUserDoc: TUser | null = await User.findById(userId)
    if (!currentUserDoc) {
      return { success: false, error: "User not found", status: null }
    }

    const targetObjectId = new Types.ObjectId(targetUserId)
    const isAlreadyMuted =
      currentUserDoc.muted?.some(
        (mutedId) => mutedId.toString() === targetUserId,
      ) || false

    let status: "Muted" | "Unmuted"

    if (isAlreadyMuted) {
      // Unmute user
      await User.findByIdAndUpdate(userId, {
        $pull: { muted: targetObjectId },
      })
      status = "Unmuted"
    } else {
      // Mute user
      await User.findByIdAndUpdate(userId, {
        $addToSet: { muted: targetObjectId },
        $pull: { following: targetObjectId }, // Also unfollow when muting
      })

      // Remove current user from target's followers
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: userId },
      })

      status = "Muted"
    }

    // revalidatePath("/")
    // revalidatePath(`/profile/${targetUserId}`)

    return {
      success: true,
      message: `User ${status.toLowerCase()} successfully`,
      status,
    }
  } catch (error) {
    console.error("Error muting/unmuting user:", error)
    return {
      success: false,
      error: "Failed to update mute status",
      status: null,
    }
  }
}

export async function blockUser(targetUserId: string): Promise<{
  success: boolean
  message?: string
  error?: string
  status: "Blocked" | "Unblocked" | null
}> {
  try {
    await connectToDatabase()
    const user = await currentUser()

    if (!user) {
      return { success: false, error: "Authentication required", status: null }
    }

    const userId = user._id?.toString()

    if (userId === targetUserId) {
      return { success: false, error: "Cannot block yourself", status: null }
    }

    const currentUserDoc: TUser | null = await User.findById(userId)
    if (!currentUserDoc) {
      return { success: false, error: "User not found", status: null }
    }

    const targetObjectId = new Types.ObjectId(targetUserId)
    const isAlreadyBlocked =
      currentUserDoc.blocked?.some(
        (blockedId) => blockedId.toString() === targetUserId,
      ) || false

    let status: "Blocked" | "Unblocked"

    if (isAlreadyBlocked) {
      // Unblock user
      await User.findByIdAndUpdate(userId, {
        $pull: {
          blocked: targetObjectId,
          muted: targetObjectId, // Also unmute when unblocking
        },
      })
      status = "Unblocked"
    } else {
      // Block user
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          blocked: targetObjectId,
          muted: targetObjectId, // Also mute when blocking
        },
        $pull: {
          following: targetObjectId,
          followers: targetObjectId,
        },
      })

      // Remove mutual connections
      await User.findByIdAndUpdate(targetUserId, {
        $pull: {
          followers: userId,
          following: userId,
        },
      })

      status = "Blocked"
    }

    // revalidatePath("/")
    // revalidatePath(`/profile/${targetUserId}`)

    return {
      success: true,
      message: `User ${status.toLowerCase()} successfully`,
      status,
    }
  } catch (error) {
    console.error("Error blocking/unblocking user:", error)
    return {
      success: false,
      error: "Failed to update block status",
      status: null,
    }
  }
}
