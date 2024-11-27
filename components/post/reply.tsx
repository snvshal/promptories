"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, Heart, Trash, Ellipsis, User } from "lucide-react"
import Link from "next/link"
import { TimeAgo } from "../time-ago"
import { TPost, TReplies } from "@/types/schema.type"
import { addReplyToPost } from "@/actions/replyActions"
import { Separator } from "../ui/separator"
import { deleteReply, handleLikeReply } from "@/actions/replyActions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { cl, il, pu, st } from "@/utils/ps"
import { useSession } from "next-auth/react"
import { Types } from "mongoose"
import { SetAction } from "@/types/generics.type"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "../ui/textarea"
import { PostFooterIconButton } from "./footer"
import { AvatarComponent } from "./content"

export function PostReplies({
  post,
  postReplies,
  setPostReplies,
}: {
  post: TPost
  postReplies: TReplies[]
  setPostReplies: SetAction<TReplies[]>
}) {
  const [replyText, setReplyText] = useState("")
  const [emptyReplyError, setEmptyReplyError] = useState("")
  const [sendingReply, setSendingReply] = useState(false)

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSendingReply(true)

    if (!replyText) {
      setEmptyReplyError("Reply is required!")
      return
    }

    try {
      const updatedReplies = await addReplyToPost(post._id as string, replyText)
      setPostReplies(updatedReplies)
      setReplyText("")

      toast({
        description: "Your reply has been sent.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your reply.",
        variant: "destructive",
      })
    } finally {
      setSendingReply(false)
    }
  }
  return (
    <Card className="mb-0 w-full rounded-none border-0 shadow-none">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold">Replies</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <form onSubmit={handleReplySubmit} className="w-full">
          <div className="flex space-x-2">
            <Input
              type="text"
              name="reply"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value)
                setEmptyReplyError("")
                setSendingReply(false)
              }}
              className="flex-1"
            />
            <Button type="submit" disabled={sendingReply}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send reply</span>
            </Button>
          </div>
        </form>
        {emptyReplyError && (
          <p className="mt-1 text-sm text-red-500">{emptyReplyError}</p>
        )}
        <Separator className="my-4" />
        <PostRepliesContent
          post={post}
          replies={postReplies}
          setPostReplies={setPostReplies}
        />
      </CardContent>
    </Card>
  )
}

export function PostRepliesContent({
  post,
  replies,
  setPostReplies,
}: {
  post: TPost
  replies: TReplies[]
  setPostReplies: SetAction<TReplies[]>
}) {
  const { data: session } = useSession()
  const user = session?.user

  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (user && replies?.length) {
      const hasLikedInitial: Record<string, boolean> = {}
      replies.forEach((reply: TReplies) => {
        hasLikedInitial[reply._id?.toString() as string] = st(
          reply.likes as Types.ObjectId[],
        ).includes(user?.id)
      })
      setHasLiked(hasLikedInitial)
    }
  }, [user, replies])

  if (!replies.length) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">No replies here yet!</p>
      </div>
    )
  }

  const handleLikeReplyClick = async (replyId: string) => {
    try {
      const newLikes = await handleLikeReply(post._id as string, replyId)

      setPostReplies(
        replies.map((reply) =>
          reply._id?.toString() === replyId
            ? { ...reply, likes: newLikes }
            : reply,
        ) as TReplies[],
      )

      setHasLiked((prev) => {
        return { ...prev, [replyId]: !prev[replyId] }
      })
    } catch (error) {
      console.error("Error updating likes on the client:", error)
    }
  }

  return (
    <div className="w-full space-y-4">
      {replies.map((reply, index) => (
        <div key={index} className="flex w-full space-x-2">
          <AvatarComponent user={pu(reply)} />
          <div className="w-[calc(100%-48px)] flex-1">
            <div className="flex-between h-6">
              <div className="flex-start">
                <Link
                  href={cl(pu(reply).username)}
                  className="flex-start gap-1"
                  prefetch={false}
                >
                  <p className="font-semibold hover:underline max-sm:hidden">
                    {pu(reply).name}
                  </p>
                  <p className="max-sm:font-semibold sm:text-muted-foreground">
                    <span className="max-sm:hidden">&#64;</span>
                    {pu(reply).username}
                  </p>
                </Link>
                <p className="text-muted-foreground">
                  <span className="px-1">&#183;</span>
                  <TimeAgo timestamp={reply.timestamp} />
                </p>
              </div>
              <PostReplyOptions
                postId={post._id as string}
                reply={reply}
                setPostReplies={setPostReplies}
              />
            </div>

            <div className="flex items-start justify-between gap-2">
              <p className="flex-1 overflow-hidden text-ellipsis max-sm:text-sm">
                {reply.content}
              </p>
              <div className="flex-start flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLikeReplyClick(reply._id as string)}
                  className="hover:bg-background"
                >
                  <Heart
                    style={{
                      color: il(hasLiked[reply._id?.toString() as string]),
                    }}
                    fill={il(hasLiked[reply._id?.toString() as string])}
                    className="size-4 text-muted-foreground"
                  />
                </Button>
                <p className="text-sm text-muted-foreground">
                  {reply.likes.length ? reply.likes.length : null}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function PostReplyOptions({
  postId,
  reply,
  setPostReplies,
}: {
  postId: string
  reply: TReplies
  setPostReplies: SetAction<TReplies[]>
}) {
  const { data: session } = useSession()

  const router = useRouter()

  const handleDeleteReplyClick = async () => {
    try {
      const updatedReplies = await deleteReply(postId, reply._id as string)
      setPostReplies(updatedReplies as TReplies[])
      toast({
        description: "Your reply has been deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting your reply.",
        variant: "destructive",
      })
    }
  }

  const authorized = pu(reply).email === session?.user.email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"} className="rounded-full">
          <Ellipsis className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Post reply options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {authorized ? (
          <DropdownMenuItem onClick={handleDeleteReplyClick}>
            <Trash className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => router.push(cl(pu(reply).username))}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function PostReplyDialog({
  post,
  children,
  setPostReplies,
}: {
  post: TPost
  children?: React.ReactNode
  setPostReplies?: SetAction<TReplies[]>
}) {
  const [dialogState, setDialogState] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [emptyReplyError, setEmptyReplyError] = useState("")
  const [repliesCount, setRepliesCount] = useState(post.replies.length)
  const [sendingReply, setSendingReply] = useState(false)

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSendingReply(true)

    if (!replyContent) {
      setEmptyReplyError("Reply is required!")
      return
    }
    try {
      const updatedReplies = await addReplyToPost(
        post._id as string,
        replyContent,
      )

      if (setPostReplies) setPostReplies(updatedReplies)

      setRepliesCount((prev) => prev + 1)
      setReplyContent("")
      setDialogState(false)

      toast({
        description: "Your reply has been sent.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your reply.",
        variant: "destructive",
      })
    } finally {
      setSendingReply(false)
    }
  }

  // Empty Textarea on Dialog Close
  const onDialogChange = () => {
    setDialogState((prev) => !prev)
    setReplyContent("")
  }

  return (
    <Dialog open={dialogState} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <PostFooterIconButton>
            <MessageCircle className="mr-2 size-4" />
            {repliesCount ? repliesCount : null}
            <span className="sr-only">Reply Post</span>
          </PostFooterIconButton>
        )}
      </DialogTrigger>
      <DialogContent className="max-sm:top-56 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Reply to{" "}
            <span className="text-blue-500">&#64;{pu(post).username}</span>
          </DialogTitle>
          <DialogDescription>
            Type your reply to this post. Click submit when you&#39;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReplySubmit} className="w-full">
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => {
                setReplyContent(e.target.value)
                setEmptyReplyError("")
                setSendingReply(false)
              }}
              className="col-span-3"
            />
            {emptyReplyError && (
              <p className="mt-1 text-sm text-red-500">{emptyReplyError}</p>
            )}
          </div>
          <Button
            className="w-full"
            aria-label="Submit Reply"
            disabled={sendingReply}
          >
            <Send className="mr-2 size-4" />
            Submit Reply
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
