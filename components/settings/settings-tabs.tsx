"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SettingsTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = pathname.includes("/appearance")
    ? "appearance"
    : pathname.includes("/username")
      ? "username"
      : "profile";

  const handleTabChange = (value: string) => {
    router.push(`/settings/${value}`);
  };

  return (
    // <div className="container p-10">
    //   <h1 className="mb-6 text-3xl font-bold">Settings</h1>
    <Tabs
      defaultValue="profile"
      value={currentTab}
      onValueChange={handleTabChange}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="username">Username</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>
      <TabsContent value="profile"></TabsContent>
      <TabsContent value="username"></TabsContent>
      <TabsContent value="appearance"></TabsContent>
    </Tabs>
    // </div>
  );
}
