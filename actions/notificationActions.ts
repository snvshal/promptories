"use server"

import { Notification } from "@/models/notification.model"
import { RemoveMongooseFields } from "@/types/generics.type"
import { TNotification, TPost, TUser } from "@/types/schema.type"
import { connectToDatabase } from "@/utils/db"
import { currentUser } from "@/utils/get-user"
import { cl, objId, postPathname } from "@/utils/ps"
import { Types } from "mongoose"

// Helper function to create a notification
async function createNotification(
  type: "like" | "comment" | "follow",
  userId: Types.ObjectId,
  actorId: Types.ObjectId,
  content: string,
  location: string,
) {
  const notification: RemoveMongooseFields<TNotification> = {
    type,
    user: userId,
    actor: actorId,
    content,
    location,
    read: false,
  }

  return await Notification.create(notification)
}

export async function likeNotification(post: TPost) {
  try {
    await connectToDatabase()
    const actor = await currentUser()

    if (!actor || objId(actor._id).equals(objId(post.user))) return

    const location = cl(postPathname(post))
    return await createNotification(
      "like",
      objId(post.user),
      objId(actor._id),
      "liked your post",
      location,
    )
  } catch (error) {
    console.error("Error Notification like:", error)
  }
}

export async function commentNotification(post: TPost) {
  try {
    await connectToDatabase()
    const actor = await currentUser()

    if (!actor || objId(actor._id).equals(objId(post.user))) return

    const location = cl(postPathname(post))
    return await createNotification(
      "comment",
      objId(post.user),
      objId(actor._id),
      "commented on your post",
      location,
    )
  } catch (error) {
    console.error("Error Notification comment:", error)
  }
}

export async function followNotification(user: TUser) {
  try {
    await connectToDatabase()
    const actor = await currentUser()

    if (!actor || objId(actor._id).equals(objId(user._id))) return

    const location = cl(actor?.username)
    return await createNotification(
      "follow",
      objId(user._id),
      objId(actor._id),
      "started following you",
      location,
    )
  } catch (error) {
    console.error("Error Notification follow:", error)
  }
}

export async function markAsReadNotification(notificationId: string) {
  try {
    const notification = await Notification.findById(notificationId)
    if (!notification)
      throw new Error("Notification not found or not authorized!")

    notification.read = true

    await notification.save()
  } catch (error) {
    console.error("Error marking notification as read:", error)
  }
}

export async function getNotificationCount() {
  try {
    await connectToDatabase()

    const user = await currentUser()
    if (!user) return 0

    const notifications = await Notification.countDocuments({
      user: user._id,
      read: false,
    })

    return notifications
  } catch (error) {
    console.error("Error getting notification count:", error)
    return 0
  }
}
