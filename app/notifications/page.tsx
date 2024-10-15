import Notifications from "@/components/notification";
import { Notification } from "@/models/notification.model";
import { TNotification } from "@/types/schema.type";
import { currentUser } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function NotificationsPage() {
  const user = await currentUser();
  const notifications = await Notification.find({ user })
    .populate("actor")
    .sort({ createdAt: -1 });
  return <Notifications notifications={ps(notifications as TNotification[])} />;
}
