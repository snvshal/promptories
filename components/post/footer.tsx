"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Heart, Tag, Bookmark, ChartNoAxesColumn } from "lucide-react"
import {
  handleLikePost,
  handleBookmarkPost,
  handlePostView,
} from "@/actions/postActions"
import { TPost, TReplies } from "@/types/schema.type"
import { useRouter } from "next/navigation"
import { handlePostShare, ib, il, objId, st } from "@/utils/ps"
import { SetAction } from "@/types/generics.type"
import { ScrollArea } from "../ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PostReplyDialog } from "./reply"
import { useUser } from "@/hooks/use-user"

export function PostFooter({
  post,
  setPostReplies,
}: {
  post: TPost
  setPostReplies?: SetAction<TReplies[]>
}) {
  const [open, setOpen] = useState(false)

  return (
    <CardFooter onClick={(e) => e.stopPropagation()} className="h-8 p-0 pt-3">
      <div className="grid w-4/5 grid-cols-4">
        <PostReplyDialog post={post} setPostReplies={setPostReplies} />
        <LikeButton post={post} />
        <BookmarkButton post={post} />
        <PostViews post={post} />
      </div>
      <div className="flex-end relative flex-1">
        <div className="absolute -right-2 flex gap-2">
          {post.tags.length > 0 && (
            <PostTagsDialog tags={post.tags} open={open} setOpen={setOpen} />
          )}

          <PostIconButton onClick={async () => await handlePostShare(post)}>
            <Share2 className="size-4" />
            <span className="sr-only">Share Post</span>
          </PostIconButton>
        </div>
      </div>
    </CardFooter>
  )
}

export function PostTagsDialog({
  tags,
  open,
  setOpen,
}: {
  tags: string[]
  open: boolean
  setOpen: SetAction<boolean>
}) {
  const router = useRouter()

  const handleTagClick = (tag: string) => {
    setOpen(false)
    router.push(`/search?q=${tag}&category=tags`)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <PostIconButton>
          <Tag className="size-4" />
          <span className="sr-only">View Tags</span>
        </PostIconButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Post Tags</DialogTitle>
          <DialogDescription>
            These tags categorize and describe the main topics of this post.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-40 rounded-lg border p-4">
          {tags.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  onClick={() => handleTagClick(tag)}
                  role="button"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="italic text-muted-foreground">
              There is no tags for this post.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function LikeButton({ post }: { post: TPost }) {
  // const { data: session } = useSession()
  // const user = session?.user

  const { user } = useUser()

  const initialLikes = post.likes.length

  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState<boolean>(false)

  const processedLikes = useMemo(() => st(post.likes), [post.likes])

  useEffect(() => {
    if (user?.id) setHasLiked(processedLikes.includes(user.id))
  }, [user?.id, processedLikes])

  const handleLikeClick = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Optimistically update state
      setHasLiked(!hasLiked)
      setLikes(hasLiked ? Math.abs(likes - 1) : likes + 1)

      // Server action to handle like/unlike
      await handleLikePost(post._id as string)
    } catch (error) {
      console.error("Failed to save post like")
    }
  }

  return (
    <div className="flex items-center justify-start">
      <form onSubmit={handleLikeClick}>
        <PostIconButton>
          <Heart
            style={{ color: il(hasLiked) }}
            fill={il(hasLiked)}
            className="size-4"
          />

          <span className="sr-only">Like Post</span>
        </PostIconButton>
      </form>
      <span className="text-xs text-muted-foreground">{likes || null}</span>
    </div>
  )
}

export function BookmarkButton({ post }: { post: TPost }) {
  // const { data: session } = useSession()
  // const user = session?.user

  const { user } = useUser()

  const initialBookmarks = post.bookmarks.length
  const hasBookmarkedInitial = post.bookmarks.includes(objId(user?.id))

  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [hasBookmarked, setHasBookmarked] = useState(hasBookmarkedInitial)

  const processedBookmarks = useMemo(() => st(post.bookmarks), [post.bookmarks])

  useEffect(() => {
    if (user?.id) setHasBookmarked(processedBookmarks.includes(user.id))
  }, [user?.id, processedBookmarks])

  const handleBookmarkClick = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Optimistically update state
      setHasBookmarked(!hasBookmarked)
      setBookmarks(hasBookmarked ? Math.abs(bookmarks - 1) : bookmarks + 1)

      // Server action to handle bookmark/unbookmark
      await handleBookmarkPost(post._id as string)
    } catch (error) {
      console.error("Failed to save post bookmark")
    }
  }

  return (
    <div className="flex items-center justify-start">
      <form onSubmit={handleBookmarkClick}>
        <PostIconButton>
          <Bookmark
            style={{ color: ib(hasBookmarked) }}
            fill={ib(hasBookmarked)}
            className="size-4"
          />
          <span className="sr-only">Bookmark Post</span>
        </PostIconButton>
      </form>
      <span className="text-xs text-muted-foreground">{bookmarks || null}</span>
    </div>
  )
}

export function PostViews({ post }: { post: TPost }) {
  // const { data: session } = useSession()
  // const user = session?.user

  const { user } = useUser()

  const postRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const currentRef = postRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio === 1 &&
            !st(post.views).includes(user?.id as string)
          ) {
            try {
              await handlePostView(post._id as string)
            } catch (error) {
              console.error("Post views not saved")
            }
          }
        })
      },
      {
        threshold: 1.0,
      },
    )

    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [post._id, post.views, user?.id])
  return (
    <div className="flex items-center justify-start">
      <PostIconButton ref={postRef}>
        <ChartNoAxesColumn className="size-4" />
        <span className="sr-only">Post Views</span>
      </PostIconButton>
      <span className="text-xs text-muted-foreground">
        {post.views.length || null}
      </span>
    </div>
  )
}

export const PostIconButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode
    onClick?: () => void
  }
>(({ children, onClick }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="h-8 w-8 rounded-full p-1 text-muted-foreground"
    >
      {children}
    </Button>
  )
})

PostIconButton.displayName = "PostIconButton"
