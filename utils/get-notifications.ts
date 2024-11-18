import { Notification } from "@/models/notification.model"
import { connectToDatabase } from "./db"
import { currentUser } from "./get-user"

export const getNotifications = async () => {
  try {
    await connectToDatabase()

    const user = await currentUser()
    const notifications = await Notification.find({ user })
      .populate("actor")
      .sort({ createdAt: -1 })
    return notifications
  } catch (error) {
    console.error(error)
  }
}
