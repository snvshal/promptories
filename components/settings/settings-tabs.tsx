"use client"

import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { cl } from "@/utils/ps"

export default function SettingsTabs() {
  const pathname = usePathname()
  const router = useRouter()

  const tabs = ["appearance", "username", "account"]
  const currentTab = tabs.find((tab) => pathname.includes(cl(tab))) || "profile"

  const handleTabChange = (value: string) => router.push(cl("settings", value))

  return (
    <Tabs
      defaultValue="profile"
      value={currentTab}
      onValueChange={handleTabChange}
      className="space-y-4"
    >
      <ScrollArea className="w-auto whitespace-nowrap rounded-md">
        <TabsList className="flex w-max">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="username">Username</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="profile"></TabsContent>
      <TabsContent value="username"></TabsContent>
      <TabsContent value="appearance"></TabsContent>
      <TabsContent value="account"></TabsContent>
    </Tabs>
  )
}
