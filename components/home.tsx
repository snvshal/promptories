"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Feather } from "lucide-react"
import { TPost } from "@/types/schema.type"
import { useRouter } from "next/navigation"
import { PostType } from "./post/content"
import { ArrowBack } from "./ui/svg-icons"
import { FeedTypeComponent } from "./sidebar"
import Link from "next/link"

import { RefreshCw, Loader2 } from "lucide-react"
import { usePosts } from "@/hooks/use-posts"
import PullToRefresh from "react-pull-to-refresh"

export function HomePageComponent() {
  const {
    posts,
    isLoading,
    isRefreshing,
    refreshPosts,
    loadMorePosts,
    hasMore,
  } = usePosts()

  const [feedPosts, setFeedPosts] = useState(posts.forYou)

  useEffect(() => {
    setFeedPosts(
      posts.feedType === "following" ? posts.following : posts.forYou,
    )
  }, [posts])

  const currentFeedType =
    posts.feedType === "following" ? "following" : "forYou"
  const hasMorePosts = hasMore[currentFeedType]

  const handleRefresh = async () => {
    try {
      await refreshPosts()
    } catch (error) {
      console.error("Refresh failed:", error)
    }
  }

  return (
    <div className="relative w-full">
      <DynamicHeader>
        <div className="mx-auto flex h-16 items-center justify-between px-4 py-3">
          <div className="flex flex-1 items-center">
            <h1 className="mr-8 text-2xl font-bold text-blue-600">
              Promptories
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <FeedTypeComponent trigger="button" />
          </div>
        </div>
      </DynamicHeader>

      <main className="main-content">
        <PullToRefresh
          onRefresh={handleRefresh}
          icon={
            <span className="-rotate-90 p-4">
              <ArrowBack />
            </span>
          }
          disabled={isLoading || isRefreshing}
        >
          {isRefreshing || isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              <PostsComponent posts={feedPosts} />

              <div className="mt-6 flex flex-col items-center gap-4 py-8">
                {hasMorePosts && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={loadMorePosts}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading more posts...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Load More
                      </>
                    )}
                  </Button>
                )}

                {!hasMorePosts && feedPosts.length > 0 && (
                  <p className="text-sm text-gray-500">
                    You&#39;ve reached the end of the feed
                  </p>
                )}

                {feedPosts.length === 0 && !isLoading && (
                  <div className="py-12 text-center">
                    <p className="mb-4 text-lg text-gray-500">
                      No posts available
                    </p>
                    <Button size="sm" variant="outline" onClick={refreshPosts}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Feed
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </PullToRefresh>
        <div className="h-40 w-full pt-5" />
      </main>

      <ComposePromptoryButton />
    </div>
  )
}

export function DynamicHeader({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollTop, setLastScrollTop] = useState(0)

  useEffect(() => {
    const scrollableElement = document.getElementById("scrollable-element")
    if (!scrollableElement) return

    const handleScroll = () => {
      const scrollTop = scrollableElement.scrollTop
      const scrollDiff = Math.abs(scrollTop - lastScrollTop)

      if (scrollDiff > 64) {
        setIsVisible(scrollTop <= lastScrollTop)
        setLastScrollTop(scrollTop)
      }
    }

    scrollableElement.addEventListener("scroll", handleScroll)
    return () => scrollableElement.removeEventListener("scroll", handleScroll)
  }, [lastScrollTop])

  return (
    <header
      className={`sticky top-0 z-20 w-full border-b bg-background shadow-sm transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {children}
    </header>
  )
}

export function NavigateBackHeader({
  page,
  rsC,
  classNames,
}: {
  page: string
  rsC?: React.ReactNode
  classNames?: string
}) {
  const router = useRouter()

  return (
    <DynamicHeader>
      <div className={`flex-between w-full p-4 ${classNames}`}>
        <div className="flex max-w-4xl items-center justify-start">
          <button onClick={() => router.back()} className="flex-start mr-6">
            <ArrowBack />
          </button>
          <h1 className="text-xl font-bold">{page}</h1>
        </div>
        <div>{rsC}</div>
      </div>
    </DynamicHeader>
  )
}

export function PostsComponent({ posts }: { posts: TPost[] }) {
  if (!posts?.length) {
    return (
      <div className="flex-center w-full p-4 max-md:pt-10">
        <p>No posts here</p>
      </div>
    )
  }

  return (
    <>
      {posts.map((post, index) => (
        <PostType key={index} post={post} type="posts" />
      ))}
    </>
  )
}

export function ComposePromptoryButton() {
  return (
    <Link href={"/compose/promptory"}>
      <Button
        size="icon"
        name="Compose Promptory"
        className="compose-button hover:bg-blue-600"
        aria-label="Compose Promptory"
      >
        <Feather className="h-6 w-6 text-white" />
      </Button>
    </Link>
  )
}
