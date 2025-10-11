"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { blockUser, muteUser } from "@/actions/user-moderation"
import { cl } from "@/utils/ps"
import Link from "next/link"
import { SettingsContentCard } from "./settings-list"
import { toast } from "@/hooks/use-toast"

export type MUser = {
  id: string
  name: string
  username: string
  avatar?: string
}

export default function PrivacyAndSafetyPage({
  mutedUsers,
  blockedUsers,
}: {
  mutedUsers: MUser[]
  blockedUsers: MUser[]
}) {
  const [muted, setMuted] = useState<MUser[]>(mutedUsers)
  const [blocked, setBlocked] = useState<MUser[]>(blockedUsers)
  const [isLoading, setIsLoading] = useState(false)

  const handleUnmute = async (id: string, username: string) => {
    try {
      setIsLoading(true)
      const { success, status } = await muteUser(id)
      if (!success) return

      setMuted((prev) => prev.filter((u) => u.id !== id))
      toast({
        variant: "default",
        description: `You ${status} @${username}`,
      })
    } catch (error) {
      console.error("Failed to unmute user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblock = async (id: string, username: string) => {
    try {
      setIsLoading(true)
      const { success, status } = await blockUser(id)
      if (!success) return

      setBlocked((prev) => prev.filter((u) => u.id !== id))
      toast({
        variant: "default",
        description: `You ${status} @${username}`,
      })
    } catch (error) {
      console.error("Failed to unblock user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SettingsContentCard title="Privacy & Safety">
      {/* Muted users */}
      <Card>
        <CardHeader>
          <CardTitle>Muted Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {muted.length > 0 ? (
            muted.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    href={cl(user.username)}
                    className="flex flex-col gap-1"
                  >
                    <span className="font-semibold leading-4 hover:underline">
                      {user.name}
                    </span>
                    <span className="leading-4 text-muted-foreground">
                      &#64;{user.username}
                    </span>
                  </Link>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnmute(user.id, user.username)}
                  disabled={isLoading}
                >
                  Unmute
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No muted users</p>
          )}
        </CardContent>
      </Card>

      {/* Blocked users */}
      <Card>
        <CardHeader>
          <CardTitle>Blocked Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {blocked.length > 0 ? (
            blocked.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    href={cl(user.username)}
                    className="flex flex-col gap-1"
                  >
                    <span className="font-semibold leading-4 hover:underline">
                      {user.name}
                    </span>
                    <span className="leading-4 text-muted-foreground">
                      &#64;{user.username}
                    </span>
                  </Link>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleUnblock(user.id, user.username)}
                  disabled={isLoading}
                >
                  Unblock
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No blocked users</p>
          )}
        </CardContent>
      </Card>
    </SettingsContentCard>
  )
}
