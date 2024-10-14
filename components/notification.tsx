"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, UserPlus, Bell } from "lucide-react";
import { NavigateBackHeader } from "./post";
import { TNotification, TUser } from "@/types/schema.type";
import { useRouter } from "next/navigation";
import { TimeAgo } from "./time-ago";

export default function Notifications({
  notifications,
}: {
  notifications: TNotification[];
}) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredNotifications = notifications.filter(
    (notification) => activeTab === "all" || notification.type === activeTab,
  );

  return (
    <div className="min-h-screen">
      <NavigateBackHeader />

      <main className="main-content">
        <Card className="mid-width-card-content w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
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
      </main>
    </div>
  );
}

export function NotificationTabsContent({
  filteredNotifications,
  tabValue,
}: {
  filteredNotifications: TNotification[];
  tabValue: string;
}) {
  const router = useRouter();

  const getIcon = (type: TNotification["type"]) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "mention":
        return <Bell className="h-4 w-4 text-yellow-500" />;
    }
  };
  return (
    <TabsContent value={tabValue} className="mt-4">
      {filteredNotifications.map((notification) => (
        <div
          role="button"
          key={notification._id?.toString() as string}
          onClick={() => router.push(notification.location)}
          className={`flex items-center space-x-4 py-4 ${notification.read ? "opacity-50" : ""}`}
        >
          <Avatar>
            <AvatarImage
              src={(notification.actor as TUser)?.avatar}
              alt={(notification.actor as TUser)?.name}
            />
            <AvatarFallback>
              {(notification.actor as TUser)?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm hover:underline">
              <span className="font-semibold">
                {(notification.actor as TUser)?.name}
              </span>{" "}
              {notification.content}
            </p>
            <p className="text-xs text-gray-500">
              <TimeAgo timestamp={notification.createdAt as Date} />
            </p>
          </div>
          <div className="flex-shrink-0">{getIcon(notification.type)}</div>
        </div>
      ))}
    </TabsContent>
  );
}
