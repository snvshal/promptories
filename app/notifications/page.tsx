import Notifications from "@/components/notification"
import { Notification } from "@/models/notification.model"
import { TNotification } from "@/types/schema.type"
import { connectToDatabase } from "@/utils/db"
import { currentUser } from "@/utils/get-user"
import { ps } from "@/utils/ps"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Stay updated with the latest notifications about your prompts, replies, and activity on Promptories.",
  openGraph: {
    title: "Notifications — Promptories",
    description:
      "Check your latest notifications and stay informed about new interactions on Promptories.",
    url: `${process.env.METADATA_BASE_URL}/notifications`,
    siteName: "Promptories",
    type: "website",
  },
  twitter: {
    title: "Notifications — Promptories",
    description:
      "Keep track of your notifications and never miss an update on Promptories.",
    card: "summary",
  },
}

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

export default async function NotificationsPage() {
  const notifications = await getNotifications()
  return <Notifications notifications={ps(notifications as TNotification[])} />
}
