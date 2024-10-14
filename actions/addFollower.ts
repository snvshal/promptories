"use server";

import { User } from "@/models/user.model";
import { connectToDatabase } from "@/utils/db";
import { currentUser } from "@/utils/get-user";
import { ps, st } from "@/utils/ps";
import { Types } from "mongoose";
import { followNotification } from "./notificationActions";

export async function addFollower(userId: string) {
  try {
    // Ensure DB connection
    await connectToDatabase();

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID!");
    }

    const user = await currentUser();
    if (!user) {
      throw new Error("Current user not found.");
    }

    const profileUser = await User.findById(userId);
    if (!profileUser) {
      throw new Error("Profile user not found.");
    }

    const isFollowing = profileUser.followers.includes(user._id);

    if (!isFollowing) {
      // Add follower
      profileUser.followers.push(user._id);
      user.following.push(profileUser._id);

      // Follow notification
      await followNotification(profileUser);
    } else {
      // Remove follower
      profileUser.followers = profileUser.followers.filter(
        (followerId: Types.ObjectId) =>
          !followerId.equals(user._id as Types.ObjectId),
      );
      user.following = user.following.filter(
        (followingId) => !followingId.equals(profileUser._id),
      );
    }

    await profileUser.save();
    await user.save();

    return ps({
      updatedState: isFollowing ? "Follow" : "Following",
      following: st(user.following),
    });
  } catch (error) {
    console.error("Error adding follower:", error);
    throw new Error("Failed to update follower.");
  }
}
