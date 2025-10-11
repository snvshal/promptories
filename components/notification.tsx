"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, UserPlus, Bell } from "lucide-react"
import { TNotification, TUser } from "@/types/schema.type"
import { useRouter } from "next/navigation"
import { TimeAgo } from "./time-ago"
import { markAsReadNotification } from "@/actions/notification"
import { NavigateBackHeader } from "./home"
import { AvatarComponent } from "./post/content"

export default function Notifications({
  notifications,
}: {
  notifications: TNotification[]
}) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = notifications.filter(
    (notification) => activeTab === "all" || notification.type === activeTab,
  )

  return (
    <div className="w-full">
      <NavigateBackHeader page="Notifications" />

      <main className="main-content">
        <Card className="mb-0 w-full rounded-none border-0 shadow-none">
          <CardContent className="p-4">
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="like">Likes</TabsTrigger>
                <TabsTrigger value="comment">Comments</TabsTrigger>
                <TabsTrigger value="follow">Follows</TabsTrigger>
              </TabsList>
              <NotificationTabsContent
                filteredNotifications={filteredNotifications}
                tabValue={activeTab}
              />
            </Tabs>
          </CardContent>
        </Card>
        <div className="h-20 w-full" />
      </main>
    </div>
  )
}

export function NotificationTabsContent({
  filteredNotifications,
  tabValue,
}: {
  filteredNotifications: TNotification[]
  tabValue: string
}) {
  return (
    <TabsContent value={tabValue} className="mt-4">
      {filteredNotifications.map((notification) => (
        <NotificationContent
          key={notification._id as string}
          notification={notification}
        />
      ))}
    </TabsContent>
  )
}

export function NotificationContent({
  notification,
}: {
  notification: TNotification
}) {
  const router = useRouter()

  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = notificationRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          // Check if the notification is fully visible (entry.intersectionRatio is 1)
          if (
            entry.isIntersecting &&
            entry.intersectionRatio === 1 &&
            !notification.read
          ) {
            try {
              await markAsReadNotification(notification._id as string)
            } catch (error) {
              console.error("notification not saved")
            } // Mark notification as seen
          }
        })
      },
      {
        threshold: 1.0, // Trigger when 100% of the element is in view
      },
    )

    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [notification._id, notification.read])

  const nactor = notification.actor as TUser

  return (
    <div
      ref={notificationRef}
      key={notification._id?.toString() as string}
      className={`flex items-center space-x-4 py-4 pr-2 ${notification.read ? "opacity-50" : ""}`}
    >
      <AvatarComponent user={nactor} />
      <div
        role="button"
        className="flex-1"
        onClick={() => router.push(notification.location)}
      >
        <p className="text-sm hover:underline">
          <span className="font-semibold">{nactor?.name}</span>{" "}
          {notification.content}
        </p>
        <p className="text-xs text-gray-500">
          <TimeAgo timestamp={notification.createdAt as Date} />
        </p>
      </div>
      <div className="flex-shrink-0">{getIcon(notification.type)}</div>
    </div>
  )
}

const getIcon = (type: TNotification["type"]) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />
    case "comment":
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    case "follow":
      return <UserPlus className="h-4 w-4 text-green-500" />
    case "mention":
      return <Bell className="h-4 w-4 text-yellow-500" />
  }
}
