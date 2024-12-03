"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostsComponent } from "../home"
import { TPost, TUser } from "@/types/schema.type"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { User } from "lucide-react"
import { NavigateBackHeader } from "../home"
import { addFollower } from "@/actions/addFollower"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { cl, st } from "@/utils/ps"
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { SetAction } from "@/types/generics.type"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { AvatarComponent } from "../post/content"

export type Tab = "posts" | "likes" | "saved"

export default function UserProfileComponent({
  profileUser,
  posts,
  likedPosts,
  bookmarkedPosts,
}: {
  profileUser: TUser
  posts: TPost[]
  likedPosts: TPost[]
  bookmarkedPosts: TPost[]
}) {
  const router = useRouter()
  const { data: session } = useSession()

  const isAdmin = profileUser.email === session?.user?.email

  const searchParams = useSearchParams()
  const query = searchParams.get("tab")

  const initialTab: Tab =
    isAdmin || query === "posts"
      ? "posts"
      : query === "likes" || query === "saved"
        ? query
        : "posts"

  const [tab, setTab] = useState<Tab>(initialTab)

  useEffect(() => {
    if (query === "posts" || query === "likes" || query === "saved") {
      setTab(query as Tab)
    } else {
      setTab("posts")
    }
  }, [query])

  const toggleTab = (tab: string) => {
    setTab(tab as Tab)
    router.push(`?tab=${tab}`)
  }
  return (
    <div className="w-full">
      <NavigateBackHeader page={profileUser.name} />

      <main className="main-content">
        <ProfileUserContent
          profileUser={profileUser}
          postCount={posts.length}
        />

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
            <PostsComponent posts={posts} />
          </TabsContent>
          {isAdmin && (
            <>
              <TabsContent value="likes" className="m-0">
                <PostsComponent posts={likedPosts} />
              </TabsContent>
              <TabsContent value="saved" className="m-0">
                <PostsComponent posts={bookmarkedPosts} />
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

export function ProfileUserContent({
  profileUser,
  postCount,
}: {
  profileUser: TUser
  postCount: number
}) {
  const [followers, setFollowers] = useState(profileUser?.followers.length)

  return (
    <Card className="mb-0 w-full rounded-none border-0 shadow-none">
      <CardContent className="pt-6 max-md:px-4 max-sm:pb-4">
        <div className="flex w-full justify-end space-x-4">
          <ProfileOptionButton
            profileUser={profileUser}
            setFollowers={setFollowers}
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
              {profileUser.social_links?.github && (
                <Link
                  target="_blank"
                  prefetch={false}
                  href={profileUser.social_links?.github as string}
                  className="text-muted-foreground hover:text-primary"
                >
                  <GitHubLogoIcon className="h-5 w-5" />
                </Link>
              )}
              {profileUser.social_links?.twitter && (
                <Link
                  target="_blank"
                  prefetch={false}
                  href={profileUser.social_links?.twitter as string}
                  className="text-muted-foreground hover:text-primary"
                >
                  <TwitterLogoIcon className="h-5 w-5" />
                </Link>
              )}
            </div>
            <div className="mt-4 flex gap-4">
              <div className="flex gap-1">
                <p className="font-semibold">{postCount}</p>
                <p className="text-muted-foreground">Posts</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">{profileUser?.following.length}</p>
                <p className="text-muted-foreground">Following</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">{followers}</p>
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
  setFollowers,
}: {
  profileUser: TUser
  setFollowers: SetAction<number>
}) {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()

  const isAdmin = profileUser.email === user?.email

  if (isAdmin) {
    return (
      <Button
        variant="outline"
        onClick={() => router.push("/settings/profile")}
      >
        Edit Profile
      </Button>
    )
  } else {
    return (
      <FollowButton profileUser={profileUser} setFollowers={setFollowers} />
    )
  }
}

export function FollowButton({
  profileUser,
  setFollowers,
}: {
  profileUser: TUser
  setFollowers: SetAction<number>
}) {
  const { data: session, update } = useSession()
  const user = session?.user

  const [hover, setHover] = useState(false)

  const isAdmin = profileUser.email === user?.email
  const [follow, setFollow] = useState<"Follow" | "Following">(() =>
    st(profileUser.followers).includes(user?.id as string)
      ? "Following"
      : "Follow",
  )

  const handleAddFollower = async () => {
    try {
      const { newFollowing, newFollowersCount, updatedState } =
        await addFollower(profileUser._id as string)

      setFollow(updatedState)
      setFollowers(newFollowersCount)

      await update({
        ...session,
        user: {
          ...session?.user,
          following: newFollowing,
        },
      })
    } catch (error) {
      console.error("Error updating follower state:", error)
    }
  }

  if (isAdmin) return

  return (
    <Button
      variant={
        follow === "Follow" ? "default" : hover ? "destructive" : "secondary"
      }
      onClick={handleAddFollower}
      onMouseEnter={() => follow === "Following" && setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && follow === "Following" ? "Unfollow" : follow}
    </Button>
  )
}

export function ProfileHoverCard({
  profileUser,
  children,
}: {
  profileUser: TUser
  children: React.ReactNode
}) {
  const [followers, setFollowers] = useState(profileUser.followers.length)

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-64 rounded-lg shadow-2xl shadow-slate-900 max-sm:hidden">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <AvatarComponent user={profileUser} classname="size-16" />
            <FollowButton
              profileUser={profileUser}
              setFollowers={setFollowers}
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
              <span className="font-semibold">{followers}</span>
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
