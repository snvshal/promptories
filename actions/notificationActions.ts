"use server";

import { Notification } from "@/models/notification.model";
import { RemoveMongooseFields } from "@/types/generics.type";
import { TNotification, TPost, TUser } from "@/types/schema.type";
import { connectToDatabase } from "@/utils/db";
import { currentUser } from "@/utils/get-user";
import { Types } from "mongoose";

export async function likeNotification(post: TPost) {
  try {
    await connectToDatabase();

    const actor = await currentUser();

    if (actor?._id?.toString() === (post.user as TUser)._id?.toString()) return;

    const notification: RemoveMongooseFields<TNotification> = {
      type: "like",
      user: (post.user as TUser)._id as Types.ObjectId,
      actor: actor?._id as Types.ObjectId,
      content: "liked your post.",
      location: `/${(post.user as TUser)?.username}/promptories/${post._id as string}`,
      read: false,
    };
    const newNotification = await Notification.create(notification);

    // return newNotification;
  } catch (error) {
    console.error("Error Notification like:", error);
  }
}

export async function commentNotification(post: TPost) {
  try {
    await connectToDatabase();

    const actor = await currentUser();

    if (actor?._id?.toString() === (post.user as TUser)._id?.toString()) return;

    const notification: RemoveMongooseFields<TNotification> = {
      type: "comment",
      user: (post.user as TUser)._id as Types.ObjectId,
      actor: actor?._id as Types.ObjectId,
      content: "commented on your post.",
      location: `/${(post.user as TUser)?.username}/promptories/${post._id as string}`,
      read: false,
    };

    const newNotification = await Notification.create(notification);

    // return newNotification;
  } catch (error) {
    console.error("Error Notification like:", error);
  }
}
