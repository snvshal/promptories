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
    <CardFooter onClick={(e) => e.stopPropagation()} className="p-0 pt-3">
      <div className="grid w-4/5 grid-cols-4">
        <PostReplyDialog post={post} setPostReplies={setPostReplies} />
        <LikeButton post={post} />
        <BookmarkButton post={post} />
        <PostViews post={post} />
      </div>
      <div className="flex-end flex-1 gap-4">
        {post.tags.length > 0 && (
          <PostTagsDialog tags={post.tags} open={open} setOpen={setOpen} />
        )}

        <PostFooterIconButton onClick={async () => await handlePostShare(post)}>
          <Share2 className="size-4" />
          <span className="sr-only">Share Post</span>
        </PostFooterIconButton>
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
        <PostFooterIconButton>
          <Tag className="size-4" />
          <span className="sr-only">View Tags</span>
        </PostFooterIconButton>
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
      setLikes(hasLiked ? Math.max(likes - 1, 0) : likes + 1)

      // Server action to handle like/unlike
      await handleLikePost(post._id as string)
    } catch (error) {
      console.error("Failed to save post like")
    }
  }

  return (
    <form onSubmit={handleLikeClick}>
      <PostFooterIconButton>
        <Heart
          style={{ color: il(hasLiked) }}
          fill={il(hasLiked)}
          className="mr-2 size-4"
        />
        {likes ? likes : null}
        <span className="sr-only">Like Post</span>
      </PostFooterIconButton>
    </form>
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
      setBookmarks(hasBookmarked ? Math.max(bookmarks - 1, 0) : bookmarks + 1)

      // Server action to handle bookmark/unbookmark
      await handleBookmarkPost(post._id as string)
    } catch (error) {
      console.error("Failed to save post bookmark")
    }
  }

  return (
    <form onSubmit={handleBookmarkClick}>
      <PostFooterIconButton>
        <Bookmark
          style={{ color: ib(hasBookmarked) }}
          fill={ib(hasBookmarked)}
          className="mr-2 size-4"
        />
        {bookmarks ? bookmarks : null}
        <span className="sr-only">Bookmark Post</span>
      </PostFooterIconButton>
    </form>
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
    <PostFooterIconButton ref={postRef}>
      <ChartNoAxesColumn className="mr-2 size-4" />
      {post.views.length < 1 ? "" : post.views.length}
      <span className="sr-only">Post Views</span>
    </PostFooterIconButton>
  )
}

export const PostFooterIconButton = React.forwardRef<
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
      size="sm"
      onClick={onClick}
      className="flex-start p-0 text-muted-foreground hover:bg-background"
    >
      {children}
    </Button>
  )
})

PostFooterIconButton.displayName = "PostFooterIconButton"
