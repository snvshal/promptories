"use server"

import { connectToDatabase } from "@/utils/db"
import { User } from "@/models/user.model"
import { ProfileFormValues } from "@/components/settings/profile"
import { reservedUsernames } from "@/lib/constants"
import { currentUser } from "@/utils/get-user"
import { revalidatePath } from "next/cache"
import { cl } from "@/utils/ps"

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
