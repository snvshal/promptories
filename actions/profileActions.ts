"use server"

import { connectToDatabase } from "@/utils/db"
import { User } from "@/models/user.model"
import { ProfileFormValues } from "@/components/settings/profile"
import { reservedUsernames } from "@/lib/constants"
import { currentUser } from "@/utils/get-user"
import { revalidatePath } from "next/cache"
import { cl } from "@/utils/ps"
import { Post } from "@/models/post.model"
import { AIChat } from "@/models/ai-chat.model"
import { Notification } from "@/models/notification.model"

export async function isUsernameUnique(
  username: string,
): Promise<{ status: boolean; message: string }> {
  if (username.length <= 2) {
    return {
      status: false,
      message: "Username must be more than two characters.",
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

    const { name, github, twitter, avatar, bio } = updatedData

    if (user.name !== name) user.name = name
    if (user.social_links) {
      if (user.social_links.github !== github) user.social_links.github = github
      if (user.social_links.twitter !== twitter)
        user.social_links.twitter = twitter
    }
    if (user.avatar !== avatar) user.avatar = avatar as string
    if (user.bio !== bio) user.bio = bio

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
    const user = await currentUser()
    if (!user) throw new Error("User not authenticated.")

    await connectToDatabase()

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
      { _id: { $in: likedPosts } },
      { $pull: { likes: deletedUser._id } },
    )

    await Post.updateMany(
      { _id: { $in: bookmarkedPosts } },
      { $pull: { bookmarks: deletedUser._id } },
    )

    await Post.updateMany(
      { _id: { $in: viewedPosts } },
      { $pull: { views: deletedUser._id } },
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

    // Remove the user from the followers/following arrays of others
    await User.updateMany(
      { followers: deletedUser._id },
      { $pull: { followers: deletedUser._id } },
    )
    await User.updateMany(
      { following: deletedUser._id },
      { $pull: { following: deletedUser._id } },
    )

    revalidatePath("/")
    return { success: true, message: "Account deleted successfully." }
  } catch (error: any) {
    console.error("Error deleting account:", error.message)
    return { success: false, message: error.message }
  }
}
