"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Feather } from "lucide-react"
import { TPost } from "@/types/schema.type"
import { useRouter } from "next/navigation"
import { PostType } from "./post/content"
import { ArrowBack } from "./ui/svg-icons"
import { FeedTypeComponent } from "./sidebar"

export function HomePageComponent({ posts }: { posts: TPost[] }) {
  return (
    <div className="w-full">
      <DynamicHeader>
        <div className="mx-auto flex h-16 items-center justify-between px-4 py-3">
          <div className="flex flex-1 items-center">
            <h1 className="mr-8 text-2xl font-bold text-blue-600">
              Promptories
            </h1>
          </div>
          <FeedTypeComponent trigger="button" />
        </div>
      </DynamicHeader>
      <main className="main-content">
        <PostsComponent posts={posts} />
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
      <div className="h-40 w-full pt-5">
        <p className="w-full text-center text-muted-foreground">·</p>
      </div>
    </>
  )
}

export function ComposePromptoryButton() {
  const router = useRouter()
  return (
    <Button
      size="icon"
      name="Compose Promptory"
      onClick={() => router.push("/compose/promptory")}
      className="compose-button"
      aria-label="Compose Promptory"
    >
      <Feather size={24} />
    </Button>
  )
}
