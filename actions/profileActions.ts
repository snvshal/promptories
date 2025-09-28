"use server"

import { connectToDatabase } from "@/utils/db"
import { User } from "@/models/user.model"
import { ProfileFormValues } from "@/components/settings/profile"
import { reservedUsernames } from "@/lib/constants"
import { currentUser } from "@/utils/get-user"
import { revalidatePath } from "next/cache"
import { cl, isValidUrl } from "@/utils/ps"
import { Post } from "@/models/post.model"
import { AIChat } from "@/models/ai-chat.model"
import { Notification } from "@/models/notification.model"

export async function isUsernameUnique(
  utusername: string,
): Promise<{ status: boolean; message: string }> {
  const username = utusername.trim()

  if (username.length < 3 || username.length > 12) {
    return {
      status: false,
      message: "Username must be 3-12 characters long.",
    }
  }

  if (username.startsWith("_")) {
    return {
      status: false,
      message: "Underscore cannot be the first character.",
    }
  }

  const validUsernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_]*$/

  if (!validUsernameRegex.test(username)) {
    return {
      status: false,
      message: "Username can only contain letters, numbers, and underscores.",
    }
  }

  if (reservedUsernames.includes(username.toLowerCase())) {
    return {
      status: false,
      message: "This username is reserved and cannot be used.",
    }
  }

  try {
    await connectToDatabase()
    const user = await User.findOne({ username })

    return {
      status: !user,
      message: !user ? "Username is unique." : "Username is already taken.",
    }
  } catch (error) {
    console.error(error)
    return {
      status: false,
      message: "An error occurred while checking the username.",
    }
  }
}

export async function updateUserData(
  updatedData: ProfileFormValues & { avatar: string | null },
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase()

    const user = await currentUser()
    if (!user) return { success: false, message: "User not found." }

    const { name, external_link, avatar, bio } = updatedData

    if (
      user.name !== name &&
      name.trim().length >= 1 &&
      name.trim().length <= 20
    ) {
      user.name = name.trim()
    }

    if (
      user.external_link !== external_link &&
      isValidUrl(external_link as string)
    ) {
      user.external_link = external_link?.trim()
    }
    if (user.avatar !== avatar) user.avatar = avatar?.trim() as string
    if (user.bio !== bio) user.bio = bio?.trim()

    await user.save()

    revalidatePath(cl(user.username))

    return { success: true, message: "User data updated successfully." }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "An error occurred while updating user data.",
    }
  }
}

export async function updateUsername(
  newUsername: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase()

    const user = await currentUser()
    if (!user) return { success: false, message: "User not found." }

    user.username = newUsername
    await user.save()

    revalidatePath(cl(user.username))

    return { success: true, message: "User data updated successfully." }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "An error occurred while updating user data.",
    }
  }
}

export async function deleteAccount() {
  try {
    await connectToDatabase()

    const user = await currentUser()
    if (!user) throw new Error("User not authenticated.")

    const deletedUser = await User.findByIdAndDelete(user._id)
    if (!deletedUser) throw new Error("User not found.")

    // Delete all posts by the user
    await Post.deleteMany({ user: deletedUser._id })

    // Remove user's replies from other posts
    await Post.updateMany(
      { "replies.user": deletedUser._id },
      { $pull: { replies: { user: deletedUser._id } } },
    )

    // Get the IDs of posts the user interacted with
    const likedPosts = deletedUser.likes || []
    const bookmarkedPosts = deletedUser.bookmarks || []
    const viewedPosts = deletedUser.views || []

    // Remove user from likes, bookmarks, and views in the respective posts
    await Post.updateMany(
      {
        $or: [
          { _id: { $in: likedPosts } },
          { _id: { $in: bookmarkedPosts } },
          { _id: { $in: viewedPosts } },
        ],
      },
      {
        $pull: {
          likes: deletedUser._id,
          bookmarks: deletedUser._id,
          views: deletedUser._id,
        },
      },
    )

    // Remove likes from replies where the user interacted
    await Post.updateMany(
      { "replies.likes": deletedUser._id },
      { $pull: { "replies.$[].likes": deletedUser._id } },
    )

    // Delete all AI chats created by the user
    await AIChat.deleteMany({ user: deletedUser._id })

    // Delete all notifications involving the user (both as actor and target)
    await Notification.deleteMany({
      $or: [{ user: deletedUser._id }, { actor: deletedUser._id }],
    })

    // After deleting user's posts
    const deletedUserPosts = deletedUser.posts || []

    // Remove deleted user's posts from likes and saved of other users
    await User.updateMany(
      {
        $or: [
          { likes: { $in: deletedUserPosts } },
          { saved: { $in: deletedUserPosts } },
        ],
      },
      {
        $pull: {
          likes: { $in: deletedUserPosts },
          saved: { $in: deletedUserPosts },
        },
      },
    )

    // Remove the user from the followers/following arrays of others
    await User.updateMany(
      {
        $or: [
          { followers: deletedUser._id },
          { following: deletedUser._id },
          { blocked: deletedUser._id },
          { muted: deletedUser._id },
        ],
      },
      {
        $pull: {
          followers: deletedUser._id,
          following: deletedUser._id,
          blocked: deletedUser._id,
          muted: deletedUser._id,
        },
      },
    )

    revalidatePath("/")
    return { success: true, message: "Account deleted successfully." }
  } catch (error) {
    return { success: false, message: "Failed to delete your account." }
  }
}
