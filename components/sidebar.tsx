"use client"

import { useEffect, useState } from "react"
import {
  Bell,
  Search,
  Feather,
  Home,
  Settings,
  TrendingUp,
  LucideProps,
  Bot,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Badge } from "./ui/badge"
import { defaultValues, postMedia } from "@/lib/constants"
import { ScrollArea } from "./ui/scroll-area"
import React from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { getNotificationCount } from "@/actions/notification"
import { getTrendingTags } from "@/actions/trending-tags"
import Cookies from "js-cookie"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PostForm from "./form"
import { SetAction } from "@/types/generics.type"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useUser } from "@/hooks/use-user"
import { usePosts } from "@/hooks/use-posts"
import { truncateString } from "@/utils/ps"
import { cn } from "@/lib/utils"
import { useIsMobileDevice } from "@/hooks/use-window"

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const pathname = usePathname()
  const isMobile = useIsMobileDevice()

  const noSidebar =
    status === "unauthenticated" ||
    pathname.endsWith("/media") ||
    pathname === "/"

  if (noSidebar) return <div className="h-dvh overflow-auto">{children}</div>

  return (
    <div className="flex h-dvh overflow-hidden max-sm:flex-col-reverse">
      <div className="max-sm:h-[var(--navbar-height)]"></div>
      <div
        id="scrollable-element"
        className="flex flex-1 justify-center overflow-y-scroll"
      >
        <aside
          className={cn(
            isMobile ? "border-0" : "border-r",
            "sticky top-0 z-50 h-dvh",
          )}
        >
          <nav className="relative bg-background sm:h-dvh sm:w-16 md:w-60">
            <div className="flex h-full flex-col justify-between py-4 max-sm:hidden">
              <div className="flex h-full w-full flex-col items-center justify-start gap-2 sm:px-2 md:px-5">
                <NavLinks />
              </div>
              <UserProfileLink />
            </div>
            <div className="fixed bottom-0 left-0 z-50 flex h-[var(--navbar-height)] w-full items-center justify-around border-t bg-background sm:hidden">
              <NavLinks />
              <UserProfileLink />
            </div>
          </nav>
        </aside>
        <div className="max-w-xl flex-1">{children}</div>
        <section
          className={cn(
            isMobile ? "border-0" : "border-l",
            "sticky top-0 h-dvh",
          )}
        >
          <SidePanel />
        </section>
      </div>
    </div>
  )
}

export type NavItems = {
  name: string
  url: string
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >
}

export const navItems: NavItems[] = [
  {
    name: "Home",
    url: "/home",
    icon: Home,
  },
  {
    name: "Search",
    url: "/search",
    icon: Search,
  },
  {
    name: "AI Chats",
    url: "/ai-chats",
    icon: Bot,
  },
  {
    name: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function NavLinks() {
  const pathname = usePathname()

  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const count = await getNotificationCount()
        setNotificationCount(count)
      } catch (error) {
        console.error("Failed to get notification count")
      }
    }

    fetchNotifications()
  }, [])

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.url}
          className={`nav-button flex-center hover:bg-accent ${pathname.startsWith(item.url) ? "bg-accent" : "bg-background"}`}
          aria-label={item.name}
          prefetch={true}
        >
          {item.url === "/notifications" ? (
            <span className="relative">
              {notificationCount > 0 && (
                <Badge className="flex-center absolute -right-1 -top-1 h-4 rounded-full px-1">
                  {notificationCount <= 10 ? notificationCount : "10+"}
                </Badge>
              )}
              <Bell className="size-6" />
            </span>
          ) : (
            <item.icon className="size-6" />
          )}

          <span
            className={`${pathname.startsWith(item.url) ? "font-bold" : "font-medium"} text-base max-md:hidden`}
          >
            {item.name}
          </span>
        </Link>
      ))}
    </>
  )
}

export function UserProfileLink() {
  const { user } = useUser()
  const pathname = usePathname()

  const isProfileRoute = pathname === `/${user?.username}`

  if (!user) return null

  return (
    <div className="flex flex-col gap-2 sm:px-2 md:px-5">
      <Link
        href={"/compose/promptory"}
        className="flex-center w-full self-center rounded-full bg-foreground p-2 text-background max-md:size-10 max-sm:hidden md:h-11 md:w-[calc(100%-1rem)] md:self-start"
        aria-label="Compose Promptory"
      >
        <Feather className="size-5 text-base md:hidden" />
        <span className="text-lg font-medium max-md:hidden">Post</span>
      </Link>

      <Link
        href={`/${user?.username}`}
        className={`${isProfileRoute ? "bg-accent" : "bg-background"} size-10 gap-2 rounded-full p-1 hover:bg-accent sm:size-12 md:flex md:h-14 md:w-full md:items-center md:justify-start md:p-2`}
        aria-label="Profile"
      >
        <Avatar className="max-sm:size-8">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback>
            <User className="size-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <span className="flex flex-col items-start gap-1 max-md:hidden">
          <span className="font-semibold leading-4">
            {truncateString(user?.name as string)}
          </span>
          <span className="leading-4 text-muted-foreground">
            &#64;{user?.username}
          </span>
        </span>
      </Link>
    </div>
  )
}

export function ComposePostButton({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: SetAction<boolean>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (searchParams.get("compose") === "true") {
    setOpen(true)
  } else {
    setOpen(false)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (open) router.push(pathname)
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => router.push(`${pathname}?compose=true`)}
          className="flex-center w-full self-center rounded-full bg-foreground p-2 text-background max-md:size-10 max-sm:hidden md:h-11 md:w-[calc(100%-1rem)] md:self-start"
          aria-label="Compose Promptory"
        >
          <Feather className="size-5 text-base md:hidden" />
          <span className="text-lg font-medium max-md:hidden">Post</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-full overflow-y-auto max-sm:p-0 sm:max-h-[calc(100dvh-4rem)]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <PostForm
          defaultFormValues={defaultValues}
          operationType="POST"
          media={postMedia}
        />
      </DialogContent>
    </Dialog>
  )
}

export function SidePanel() {
  const [inputValue, setInputValue] = useState("")

  const router = useRouter()
  const pathname = usePathname()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${inputValue}`)
  }

  return (
    <div className="w-[18rem] overflow-hidden px-4 pt-4 max-lg:hidden">
      {pathname === "/home" && (
        <div className="flex-center mt-2">
          <form onSubmit={onSubmit} className="w-full">
            <Input
              name="search"
              placeholder="Search"
              value={inputValue}
              className="w-full rounded-lg"
              onChange={(e) => setInputValue(e.target.value)}
            />
          </form>
        </div>
      )}
      {pathname === "/home" && (
        <div className="my-2 flex w-full flex-col gap-2">
          {/* <Select value={promptoryType} onValueChange={setPromptoryType}>
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Promptory Types" />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-2xl shadow-slate-900">
              <ScrollArea className="h-48 rounded-lg">
                <SelectItem value="every">Every</SelectItem>
                {promptory_types.map((type, index) => (
                  <SelectItem key={index} value={type}>
                    <span className="capitalize">{type}</span>
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select> */}
          <FeedTypeComponent />
        </div>
      )}
      {pathname === "/home" && <TrendingTags />}
    </div>
  )
}

export function TrendingTags() {
  const [trendingTags, setTrendingTags] = useState<
    { tag: string; count: number }[]
  >([])

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getTrendingTags()
      setTrendingTags(tags)
    }
    fetchTags()
  }, [])

  if (!trendingTags.length) return <TrendingTagsSkeleton />

  return (
    <div className="flex-center flex-col">
      <ScrollArea className="h-[17rem] w-full rounded-lg border shadow">
        <h2 className="flex-start sticky top-0 w-full gap-2 bg-background px-4 py-2 text-lg font-medium">
          <TrendingUp />
          <span>Trending</span>
        </h2>
        {trendingTags.map((tag, index) => (
          <Link
            key={index}
            href={`/search?q=${tag.tag}&category=tags`}
            className="flex-between w-full gap-2 px-4 py-1 hover:bg-accent hover:text-accent-foreground"
          >
            <span className="flex-start gap-2">
              <span className="font-mono text-lg">$</span>
              <span>{tag.tag}</span>
            </span>

            <span className="text-sm text-muted-foreground">{tag.count}</span>
          </Link>
        ))}
      </ScrollArea>
    </div>
  )
}

export function TrendingTagsSkeleton() {
  return (
    <div className="flex-center flex-col">
      <ScrollArea className="h-[17rem] w-full rounded-lg border shadow">
        <h2 className="flex-start sticky top-0 w-full gap-2 bg-background px-4 py-2 text-lg font-medium">
          <TrendingUp />
          <span>Trending</span>
        </h2>

        {/* Skeleton Items */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex-between w-full animate-pulse gap-2 px-4 py-2"
          >
            <div className="flex-start gap-2">
              <div className="h-5 w-5 rounded bg-muted" />
              <div className="h-5 w-24 rounded bg-muted" />
            </div>
            <div className="h-4 w-10 rounded bg-muted" />
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

export function FeedTypeComponent({
  trigger,
}: {
  trigger?: "button" | "select"
}) {
  const { setPosts } = usePosts()

  const [feedType, setFeedType] = useState<string>("for_you")

  useEffect(() => {
    const ft = Cookies.get("feed_type") as "for_you" | "following"
    setFeedType(ft ?? "for_you")
  }, [])

  useEffect(() => {
    Cookies.set("feed_type", feedType, { expires: 28 })
    setPosts((prev) => ({
      ...prev,
      feedType: feedType as "for_you" | "following",
    }))
  }, [feedType, setPosts])

  return (
    <>
      {trigger === "button" ? (
        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() =>
            setFeedType(feedType === "for_you" ? "following" : "for_you")
          }
        >
          {feedType === "for_you" ? "For You" : "Following"}
        </Button>
      ) : (
        <Select value={feedType} onValueChange={setFeedType}>
          <SelectTrigger className="rounded-lg">
            <SelectValue placeholder="Feed Types" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-2xl shadow-slate-900">
            <SelectItem value="for_you">For You</SelectItem>
            <SelectItem value="following">Following</SelectItem>
          </SelectContent>
        </Select>
      )}
    </>
  )
}
