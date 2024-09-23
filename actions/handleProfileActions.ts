"use server";

import { connectToDatabase } from "@/utils/db";
import { User } from "@/models/user.model";
import { TUser } from "@/types/schema.type";
import { ProfileFormValues } from "@/components/settings/profile";

const reservedUsernames = [
  "admin",
  "user",
  "test",
  "home",
  "profile",
  "settings",
];

export async function isUsernameUnique(
  username: string,
): Promise<{ status: boolean; message: string }> {
  if (username.length <= 2) {
    return {
      status: false,
      message: "Username must be more than two characters.",
    };
  }

  if (reservedUsernames.includes(username.toLowerCase())) {
    return {
      status: false,
      message: "This username is reserved and cannot be used.",
    };
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ username });

    return {
      status: !user,
      message: !user ? "Username is unique." : "Username is already taken.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "An error occurred while checking the username.",
    };
  }
}

export async function updateUserData(
  userId: string,
  updateData: ProfileFormValues,
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();

    const updatedData = {
      ...updateData,
      socialLinks: { twitter: updateData.twitter, github: updateData.github },
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    });

    if (!updatedUser) {
      return { success: false, message: "User not found." };
    }

    return { success: true, message: "User data updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while updating user data.",
    };
  }
}

export async function updateUsername(
  userId: string,
  newUsername: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the update against the schema
      },
    );

    if (!updatedUser) {
      return { success: false, message: "User not found." };
    }

    return { success: true, message: "User data updated successfully." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while updating user data.",
    };
  }
}
