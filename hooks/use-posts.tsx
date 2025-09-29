"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { TPost } from "@/types/schema.type"
import {
  fetchFeedPosts,
  getFollowingPosts,
  getPosts,
} from "@/actions/getFeedPosts"
import { Types } from "mongoose"

export type FeedPostsType = {
  feedType: "for_you" | "following"
  forYou: TPost[]
  following: TPost[]
}

type PostsContextType = {
  posts: FeedPostsType
  setPosts: React.Dispatch<React.SetStateAction<FeedPostsType>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isRefreshing: boolean
  setIsRefreshing: React.Dispatch<React.SetStateAction<boolean>>
  refreshPosts: () => Promise<void>
  loadMorePosts: () => Promise<void>
  hasMore: {
    forYou: boolean
    following: boolean
  }
  setHasMore: React.Dispatch<
    React.SetStateAction<{
      forYou: boolean
      following: boolean
    }>
  >
  removePost: (postId: string | string[]) => void
}

const PostsContext = createContext<PostsContextType | null>(null)

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<FeedPostsType>({
    feedType: "for_you",
    forYou: [],
    following: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [hasMore, setHasMore] = useState({
    forYou: true,
    following: true,
  })

  useEffect(() => {
    const getPosts = async () => {
      const initialPosts = await fetchFeedPosts()
      setPosts(initialPosts)
    }
    getPosts()
    setIsRefreshing(false)
  }, [])

  const refreshPosts = async () => {
    if (isRefreshing || isLoading) {
      return
    }

    try {
      setIsRefreshing(true)
      const freshPosts = await fetchFeedPosts(10)
      setPosts(freshPosts)
      setHasMore({
        forYou: freshPosts.forYou.length >= 10,
        following: freshPosts.following.length >= 10,
      })
    } catch (error) {
      console.error("Error refreshing posts:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const loadMorePosts = async () => {
    // Prevent multiple simultaneous calls
    if (isLoading || isRefreshing) {
      return
    }

    const isFollowingFeed = posts.feedType === "following"
    const feedKey = isFollowingFeed ? "following" : "forYou"
    const currentPosts = posts[feedKey]

    // Check if we have more posts to load
    if (!hasMore[feedKey]) {
      return
    }

    try {
      setIsLoading(true)
      const offset = currentPosts.length

      let newPosts: TPost[] = []
      if (isFollowingFeed) {
        newPosts = await getFollowingPosts(10, offset)
      } else {
        newPosts = await getPosts(10, offset)
      }

      // Only update state if we have new posts
      if (newPosts && newPosts.length > 0) {
        setPosts((prev) => ({
          ...prev,
          [feedKey]: [...prev[feedKey], ...newPosts],
        }))

        // Update hasMore if we received fewer posts than requested
        if (newPosts.length < 10) {
          setHasMore((prev) => ({
            ...prev,
            [feedKey]: false,
          }))
        }
      } else {
        // No more posts available
        setHasMore((prev) => ({
          ...prev,
          [feedKey]: false,
        }))
      }
    } catch (error) {
      console.error("Error loading more posts:", error)
      // Don't update hasMore on error, allow retry
    } finally {
      setIsLoading(false)
    }
  }

  const removePost = (postId: string | string[]) => {
    setPosts((prev) => {
      const ids = Array.isArray(postId) ? postId : [postId]

      return {
        ...prev,
        forYou: prev.forYou.filter(
          (p) => !ids.includes((p._id as Types.ObjectId).toString()),
        ),
        following: prev.following.filter(
          (p) => !ids.includes((p._id as Types.ObjectId).toString()),
        ),
      }
    })
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        isLoading,
        setIsLoading,
        isRefreshing,
        setIsRefreshing,
        refreshPosts,
        loadMorePosts,
        hasMore,
        setHasMore,
        removePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const ctx = useContext(PostsContext)
  if (!ctx) throw new Error("usePosts must be used inside PostsProvider")
  return ctx
}
