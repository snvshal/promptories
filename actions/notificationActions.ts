"use server";

import { Notification } from "@/models/notification.model";
import { TPost, TUser } from "@/types/schema.type";
import { connectToDatabase } from "@/utils/db";
import { currentUser } from "@/utils/get-user";

export async function likeNotification(post: TPost) {
  try {
    await connectToDatabase();

    const actor = await currentUser();

    if (actor?._id?.toString() === (post.user as TUser)._id?.toString()) return;

    const newNotification = Notification.create({
      type: "like",
      user: post.user as TUser,
      actor: actor,
      content: "liked your post.",
      location: `/${(post.user as TUser)?.username}/promptories/${post._id as string}`,
      read: false,
    });

    // return newNotification;
  } catch (error) {
    console.error("Error Notification like:", error);
  }
}
