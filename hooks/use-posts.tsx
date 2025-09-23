"use client"

import { createContext, useContext, useState } from "react"
import { TPost } from "@/types/schema.type"

export type FeedPostsType = {
  feedType: "for_you" | "following"
  forYou: TPost[]
  following: TPost[]
}

type PostsContextType = {
  posts: FeedPostsType
  setPosts: React.Dispatch<React.SetStateAction<FeedPostsType>>
}

const PostsContext = createContext<PostsContextType | null>(null)

export function PostsProvider({
  children,
  initialPosts,
}: {
  children: React.ReactNode
  initialPosts: FeedPostsType
}) {
  const [posts, setPosts] = useState<FeedPostsType>(initialPosts)
  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const ctx = useContext(PostsContext)
  if (!ctx) throw new Error("usePosts must be used inside PostsProvider")
  return ctx
}
