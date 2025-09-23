"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DynamicHeader, PostsComponent } from "../home"
import { TPost, TUser } from "@/types/schema.type"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Link2Icon, User } from "lucide-react"
import { NavigateBackHeader } from "../home"
import { addFollower } from "@/actions/addFollower"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { cl } from "@/utils/ps"
import Link from "next/link"
import { SetAction } from "@/types/generics.type"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { AvatarComponent } from "../post/content"
import { ArrowBack } from "../ui/svg-icons"
import { useUser } from "@/hooks/use-user"
import { Types } from "mongoose"
import { tabs } from "@/lib/constants"

export type Tab = "posts" | "likes" | "saved"

export default function UserProfileComponent({
  profileUser,
}: {
  profileUser: TUser
}) {
  const router = useRouter()
  const { data: session } = useSession()

  const isAdmin = profileUser?.email === session?.user?.email

  const searchParams = useSearchParams()
  const query = searchParams.get("tab")

  const initialTab: Tab = isAdmin
    ? tabs.includes(query as Tab)
      ? (query as Tab)
      : "posts"
    : "posts"

  const [tab, setTab] = useState<Tab>(initialTab)

  const toggleTab = (stdTab: string) => {
    setTab(stdTab as Tab)
    router.push(`?tab=${stdTab}`, { scroll: false })
  }
  return (
    <div className="w-full">
      {/* <NavigateBackHeader page={profileUser.name} /> */}
      <DynamicHeader>
        <div className="flex-between w-full px-4 py-2">
          <div className="flex max-w-4xl items-center justify-start">
            <button onClick={() => router.back()} className="flex-start mr-6">
              <ArrowBack />
            </button>
            <div className="block">
              <h1 className="text-xl font-bold">{profileUser?.name}</h1>
              <p className="text-xs text-muted-foreground">
                {profileUser?.posts.length} promptories
              </p>
            </div>
          </div>
        </div>
      </DynamicHeader>

      <main className="main-content">
        <ProfileUserContent profileUser={profileUser as TUser} />

        <Tabs defaultValue={tab} onValueChange={toggleTab} className="w-full">
          <TabsList
            className={`grid w-full ${isAdmin ? "grid-cols-3" : "grid-cols-1"} mt-4 h-12 rounded-none border-b bg-background p-0`}
          >
            <TabsTriggerButton tab={tab} tabValue="posts">
              Posts
            </TabsTriggerButton>
            {isAdmin && (
              <>
                <TabsTriggerButton tab={tab} tabValue="likes">
                  Likes
                </TabsTriggerButton>
                <TabsTriggerButton tab={tab} tabValue="saved">
                  Saved
                </TabsTriggerButton>
              </>
            )}
          </TabsList>

          <TabsContent value="posts" className="m-0">
            <PostsComponent posts={profileUser?.posts as TPost[]} />
          </TabsContent>
          {isAdmin && (
            <>
              <TabsContent value="likes" className="m-0">
                <PostsComponent posts={profileUser?.likes as TPost[]} />
              </TabsContent>
              <TabsContent value="saved" className="m-0">
                <PostsComponent posts={profileUser?.saved as TPost[]} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
}

export function TabsTriggerButton({
  tabValue,
  tab,
  children,
}: {
  tabValue: string
  tab: string
  children: React.ReactNode
}) {
  return (
    <TabsTrigger
      role="button"
      value={tabValue}
      className="flex-center relative h-full w-full flex-col rounded-none p-0 px-4 hover:bg-accent data-[state=active]:shadow-none"
    >
      {children}
      <span
        className={`${tab === tabValue ? "visible" : "invisible"} absolute bottom-0 mt-2 h-1 w-[calc(100%-20px)] rounded bg-indigo-500`}
      ></span>
    </TabsTrigger>
  )
}

export function ProfileUserContent({ profileUser }: { profileUser: TUser }) {
  const [followersCount, setFollowersCount] = useState(
    profileUser.followers.length ?? 0,
  )

  return (
    <Card className="mb-0 w-full rounded-none border-0 shadow-none">
      <CardContent className="pt-6 max-md:px-4 max-sm:pb-4">
        <div className="flex w-full justify-end space-x-4">
          <ProfileOptionButton
            profileUser={profileUser}
            setFollowersCount={setFollowersCount}
          />
        </div>
        <div className="sm:flex-start flex max-sm:flex-col">
          <Avatar className="size-32 self-start max-sm:mb-4 sm:mr-3 md:mr-4 md:size-40">
            <AvatarImage src={profileUser?.avatar} alt={profileUser?.name} />
            <AvatarFallback>
              <User className="size-16 text-muted-foreground md:size-20" />
            </AvatarFallback>
          </Avatar>
          <div className="flex grow flex-col items-start">
            <h2 className="text-2xl font-bold">{profileUser?.name}</h2>
            <p className="text-muted-foreground">
              &#64;{profileUser?.username}
            </p>
            <p className="mt-2">{profileUser?.bio}</p>
            <div className="mt-4 flex items-center space-x-4">
              {profileUser.external_link && (
                <Link
                  target="_blank"
                  prefetch={false}
                  href={profileUser.external_link as string}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Link2Icon className="h-5 w-5" />
                </Link>
              )}
            </div>
            <div className="mt-4 flex gap-4">
              <div className="flex gap-1">
                <p className="font-semibold">{profileUser?.following.length}</p>
                <p className="text-muted-foreground">Following</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">{followersCount}</p>
                <p className="text-muted-foreground">Followers</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function UserNotFound() {
  const { username } = useParams()
  return (
    <div>
      <NavigateBackHeader page="User not found" />
      <div className="main-content">
        <Card className="mb-0 mt-8 w-full rounded-none border-0 shadow-none">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="mb-4 size-32">
                <AvatarImage src={""} alt={"user not found!"} />
                <AvatarFallback>
                  <User className="size-16 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <CardHeader className="text-2xl font-bold">
                User Not Found!
              </CardHeader>
              <div className="pb-3">
                <p>
                  We couldn&#39;t find a user with the username &#64;{username}.
                </p>
              </div>
              <CardFooter>
                The user may have changed their username or the account may no
                longer exist.
              </CardFooter>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ProfileOptionButton({
  profileUser,
  setFollowersCount,
}: {
  profileUser: TUser
  setFollowersCount: SetAction<number>
}) {
  const { data: session } = useSession()
  const user = session?.user

  const isAdmin = profileUser.email === user?.email

  if (isAdmin) {
    return (
      <Link href="/settings/profile">
        <Button variant="outline">Edit Profile</Button>
      </Link>
    )
  } else {
    return (
      <FollowButton
        profileUser={profileUser}
        setFollowersCount={setFollowersCount}
      />
    )
  }
}

export function FollowButton({
  profileUser,
  setFollowersCount,
}: {
  profileUser: TUser
  setFollowersCount?: SetAction<number>
}) {
  const { user, setUser } = useUser()
  const [hover, setHover] = useState(false)
  const [loading, setLoading] = useState(false)

  const isAdmin = profileUser.email === user?.email
  const [follow, setFollow] = useState<"Follow" | "Following">("Follow")

  useEffect(() => {
    const isFollowing = user?.following.includes(
      (profileUser._id as Types.ObjectId).toString(),
    )
      ? "Following"
      : "Follow"
    setFollow(isFollowing)
  }, [profileUser.followers, user?.following, user?.id, profileUser._id])

  const handleAddFollower = async () => {
    try {
      setLoading(true)
      const { success, status } = await addFollower(profileUser._id as string)
      if (success && status) {
        setFollow(status)
        setUser((prev) =>
          prev
            ? {
                ...prev,
                following:
                  status === "Following"
                    ? [...prev.following, profileUser._id?.toString() as string]
                    : prev.following.filter(
                        (id) => id !== profileUser._id?.toString(),
                      ),
              }
            : prev,
        )
      }

      setFollowersCount?.((prev: number) =>
        Math.abs(status === "Following" ? prev + 1 : prev - 1),
      )
    } catch (error) {
      console.error("Error updating follower state:", error)
    } finally {
      setLoading(false)
    }
  }

  if (isAdmin) return null

  return (
    <Button
      variant={
        follow === "Follow" ? "default" : hover ? "destructive" : "secondary"
      }
      onClick={handleAddFollower}
      onMouseEnter={() => follow === "Following" && setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={loading}
    >
      {loading ? (
        <LoadingDots />
      ) : hover && follow === "Following" ? (
        "Unfollow"
      ) : (
        follow
      )}
    </Button>
  )
}

const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.1s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.3s]"></div>
    </div>
  )
}

export function ProfileHoverCard({
  profileUser,
  children,
}: {
  profileUser: TUser
  children: React.ReactNode
}) {
  const [followersCount, setFollowersCount] = useState(
    profileUser.followers.length,
  )
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-64 rounded-lg shadow-2xl shadow-slate-900 max-sm:hidden">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <AvatarComponent user={profileUser} classname="size-16" />
            <FollowButton
              profileUser={profileUser}
              setFollowersCount={setFollowersCount}
            />
          </div>

          <Link
            href={cl(profileUser.username)}
            className="mt-2 flex cursor-pointer flex-col gap-0"
          >
            <p className="text-lg font-semibold leading-4 hover:underline">
              {profileUser.name}
            </p>
            <p className="text-muted-foreground">&#64;{profileUser.username}</p>
          </Link>

          {profileUser.bio && <p className="mt-3 text-sm">{profileUser.bio}</p>}

          <div className="mt-3 flex gap-4 text-sm">
            <div className="flex gap-1">
              <span className="font-semibold">
                {profileUser.following.length}
              </span>
              <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex gap-1">
              <span className="font-semibold">{followersCount}</span>
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
