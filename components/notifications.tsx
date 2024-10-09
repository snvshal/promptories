"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, UserPlus, Bell } from "lucide-react";
import { NavigateBackHeader } from "./post";
import { TNotification, TUser } from "@/types/schema.type";
import { useRouter } from "next/navigation";

type Notification = {
  id: number;
  type: "like" | "comment" | "follow" | "mention";
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
};

export default function Notifications({
  notifications,
}: {
  notifications: TNotification[];
}) {
  const [activeTab, setActiveTab] = useState("all");

  const router = useRouter();
  // Mock notifications data
  //   const notifications: Notification[] = [
  //     {
  //       id: 1,
  //       type: "like",
  //       user: {
  //         name: "Alice Johnson",
  //         username: "@alicewrites",
  //         avatar: "/placeholder.svg?height=40&width=40",
  //       },
  //       content: "liked your post about creative writing prompts",
  //       timestamp: "2023-06-20T10:30:00Z",
  //       read: false,
  //     },
  //     {
  //       id: 2,
  //       type: "comment",
  //       user: {
  //         name: "Bob Smith",
  //         username: "@datasmith",
  //         avatar: "/placeholder.svg?height=40&width=40",
  //       },
  //       content: "commented on your data analysis prompt",
  //       timestamp: "2023-06-19T15:45:00Z",
  //       read: true,
  //     },
  //     {
  //       id: 3,
  //       type: "follow",
  //       user: {
  //         name: "Carol White",
  //         username: "@carolw",
  //         avatar: "/placeholder.svg?height=40&width=40",
  //       },
  //       content: "started following you",
  //       timestamp: "2023-06-18T09:15:00Z",
  //       read: false,
  //     },
  //     {
  //       id: 4,
  //       type: "mention",
  //       user: {
  //         name: "David Brown",
  //         username: "@davidb",
  //         avatar: "/placeholder.svg?height=40&width=40",
  //       },
  //       content: "mentioned you in a comment",
  //       timestamp: "2023-06-17T20:00:00Z",
  //       read: true,
  //     },
  //   ];

  const getIcon = (type: Notification["type"]) => {
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
              <TabsContent value="all" className="mt-4">
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
                      <p className="text-sm font-medium">
                        <span className="font-semibold">
                          {(notification.actor as TUser)?.name}
                        </span>{" "}
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {/* {new Date(notification.timestamp).toLocaleString()} */}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="like" className="mt-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
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
                      <p className="text-sm font-medium">
                        <span className="font-semibold">
                          {(notification.actor as TUser)?.name}
                        </span>{" "}
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {/* {new Date(notification.timestamp).toLocaleString()} */}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="comment" className="mt-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
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
                      <p className="text-sm font-medium">
                        <span className="font-semibold">
                          {(notification.actor as TUser)?.name}
                        </span>{" "}
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {/* {new Date(notification.timestamp).toLocaleString()} */}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="follow" className="mt-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
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
                      <p className="text-sm font-medium">
                        <span className="font-semibold">
                          {(notification.actor as TUser)?.name}
                        </span>{" "}
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {/* {new Date(notification.timestamp).toLocaleString()} */}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
