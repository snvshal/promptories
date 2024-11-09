"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Share2,
  Send,
  ArrowLeft,
  Heart,
  Trash,
  Ellipsis,
  User,
  SquareArrowOutUpRight,
  MessageSquareShare,
  Tag,
  Edit,
} from "lucide-react"
import Link from "next/link"
import {
  BookmarkButton,
  DynamicHeader,
  il,
  LikeButton,
  PostIconButton,
  PostReplyDialog,
  PostViews,
  pu,
} from "./home"
import { TimeAgo } from "./time-ago"
import { TPost, TReplies, TUser } from "@/types/schema.type"
import { addReplyToPost } from "@/actions/addReplyToPost"
import { Separator } from "./ui/separator"
import { deleteReply, handleLikeReply } from "@/actions/replyActions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { handleDeletePost } from "@/actions/postActions"
import { handlePostShare, st } from "@/utils/ps"
import { useSession } from "next-auth/react"
import { Types } from "mongoose"
import { SetAction } from "@/types/generics.type"
import { ScrollArea } from "./ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

export default function SinglePostPage({ post }: { post: TPost }) {
  const [postReplies, setPostReplies] = useState(post.replies)

  return (
    <div className="min-h-screen w-full">
      <NavigateBackHeader page="Post" />
      <main className="main-content">
        <PostType post={post} type="post" />
        <PostReplies
          post={post}
          postReplies={postReplies}
          setPostReplies={setPostReplies}
        />
      </main>
      <PromptoryReplyButton post={post} setPostReplies={setPostReplies} />
    </div>
  )
}

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

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyText) {
      setEmptyReplyError("Reply is required!")
      return
    }

    try {
      const updatedPost = await addReplyToPost(post._id as string, replyText)
      setPostReplies(updatedPost.replies)
      console.log("Reply submitted:", replyText)
      setReplyText("")
      // Here you would typically send the reply to your backend
      toast({
        description: "Your reply has been sent.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your reply.",
        variant: "destructive",
      })
    }
  }
  return (
    <Card className="mid-width-card-content">
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
              }}
              className="flex-1"
            />
            <Button type="submit">
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
    <div className="space-y-4">
      {replies.map((reply, index) => (
        <div key={index} className="flex space-x-2">
          <Avatar>
            <AvatarImage src={pu(reply).avatar} alt={pu(reply).name} />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex-between h-6">
              <div className="flex-start">
                <Link
                  href={`/${pu(reply).username}`}
                  className="flex-start gap-1"
                  prefetch={false}
                >
                  <p className="font-semibold max-sm:hidden">
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
              <p>{reply.reply}</p>
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
                    className="h-4 w-4"
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

export function NavigateBackHeader({ page }: { page: string }) {
  const router = useRouter()

  return (
    <DynamicHeader>
      <div className="mx-auto flex max-w-4xl items-center justify-start p-4">
        <button onClick={() => router.back()} className="flex-start">
          <ArrowLeft className="mr-6 size-6" />
        </button>
        <h1 className="text-xl font-bold">{page}</h1>
      </div>
    </DynamicHeader>
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
      const newReplies = await deleteReply(postId, reply._id as string)
      setPostReplies(newReplies as TReplies[])
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

  const authorized = reply.user._id?.toString() === session?.user.id

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
            onClick={() => router.push(`/${pu(reply).username}`)}
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

export function PostOptions({
  post,
  type,
}: {
  post: TPost
  type: "post" | "posts"
}) {
  const { data: session } = useSession()
  const user = session?.user

  const router = useRouter()

  const handleDeletePostClick = async () => {
    try {
      const data_key = post._id?.toString() as string
      const element = document.querySelector(`[data-key="${data_key}"]`)

      if (element) {
        await handleDeletePost(post._id as string)
        type === "post" && router.push("/home")
        element.remove()
      }

      toast({
        description: "Your post has been deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting your post.",
        variant: "destructive",
      })
    }
  }

  const authorized = post.user._id?.toString() === user?.id

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant={"ghost"}
          className={`${type === "post" && "self-start"} absolute -right-2 size-8 rounded-full`}
        >
          <Ellipsis className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Post options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuItem
          onClick={() => router.push(`/${pu(post).username}`)}
          className="cursor-pointer sm:hidden"
        >
          <User className="mr-2 h-4 w-4" />
          <span>&#64;{pu(post).username}</span>
        </DropdownMenuItem>
        <Link href={post.model_url} target="_black" prefetch={false}>
          <DropdownMenuItem className="cursor-pointer">
            <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
            <span>Try it</span>
          </DropdownMenuItem>
        </Link>
        {post.chat_link && (
          <Link href={post.chat_link} target="_black" prefetch={false}>
            <DropdownMenuItem className="cursor-pointer">
              <MessageSquareShare className="mr-2 h-4 w-4" />
              <span>View chat</span>
            </DropdownMenuItem>
          </Link>
        )}
        {authorized && (
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/${pu(post).username}/promptories/${post._id as string}/edit`,
              )
            }
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}
        {authorized && (
          <DropdownMenuItem
            onClick={handleDeletePostClick}
            className="cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function PromptoryReplyButton({
  post,
  setPostReplies,
}: {
  post: TPost
  setPostReplies: SetAction<TReplies[]>
}) {
  return (
    <PostReplyDialog post={post} setPostReplies={setPostReplies}>
      <Button size={"icon"} className="compose-button">
        <MessageCircle size={24} />
      </Button>
    </PostReplyDialog>
  )
}

export function PostType({ post, type }: PostContentProps) {
  return (
    <Card
      className="mid-width-card-content flex px-4 py-3"
      data-key={post._id?.toString() as string}
    >
      {type === "posts" && (
        <div className="mr-2 flex items-start">
          <AvatarComponent user={pu(post)} />
        </div>
      )}
      <div className="flex-1">
        <PostHeader type={type} post={post} />
        <PostContent type={type} post={post} />
        {type === "post" && <PostTime createdAt={post.createdAt as Date} />}
        <PostFooter post={post} />
      </div>
    </Card>
  )
}

export function AvatarComponent({ user }: { user: TUser }) {
  const router = useRouter()
  return (
    <Avatar
      role="button"
      className="cursor-pointer"
      onClick={() => router.push(`/${user?.username}`)}
    >
      <AvatarImage src={user?.avatar} alt={user?.name} />
      <AvatarFallback>
        <User className="size-5" />
      </AvatarFallback>
    </Avatar>
  )
}

export function PostContentType({
  type,
  content,
}: {
  type: "post" | "posts"
  content: string
}) {
  if (type === "post") {
    return <p className="whitespace-pre-wrap text-lg">{content}</p>
  } else {
    return (
      <>
        <p className="whitespace-pre-wrap">
          {content.split(" ").slice(0, 24).join(" ")}
        </p>
        {content.split(" ").length > 24 && (
          <button className="text-blue-500 hover:underline">Show more</button>
        )}
      </>
    )
  }
}

export type PostContentProps = { type: "post" | "posts"; post: TPost }

export function PostHeader({ type, post }: PostContentProps) {
  return (
    <CardHeader className="p-0">
      <div className={`${type === "post" && "mb-4"} flex-between relative`}>
        <div className="flex-start">
          {type === "post" && (
            <div className="mr-2">
              <AvatarComponent user={pu(post)} />
            </div>
          )}
          <PostAuthorName type={type} postAuthor={pu(post)} />
          {type === "posts" && (
            <p className="text-muted-foreground">
              <span className="px-1">&#183;</span>
              <TimeAgo timestamp={post.createdAt as Date} />
            </p>
          )}
        </div>
        <PostOptions post={post} type={type} />
      </div>
    </CardHeader>
  )
}

export function PostAuthorName({
  type,
  postAuthor,
}: {
  type: "post" | "posts"
  postAuthor: TUser
}) {
  if (type === "post") {
    return (
      <div className="flex cursor-pointer flex-col gap-0">
        <p className="font-semibold hover:underline">{postAuthor.name}</p>
        <p className="text-muted-foreground">&#64;{postAuthor.username}</p>
      </div>
    )
  } else {
    return (
      <div className="flex cursor-pointer items-center justify-start gap-1">
        <p className="font-semibold hover:underline max-sm:hidden">
          {postAuthor.name}
        </p>
        <p className="max-sm:font-semibold sm:text-muted-foreground">
          <span className="max-sm:hidden">&#64;</span>
          {postAuthor.username}
        </p>
      </div>
    )
  }
}

export function PostTime({ createdAt }: { createdAt: Date }) {
  return (
    <div className="flex-start border-b py-2 text-sm text-muted-foreground">
      {new Date(createdAt as Date).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}
      <span className="px-1">&#183;</span>
      {new Date(createdAt as Date).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </div>
  )
}

export function PostContent({ type, post }: PostContentProps) {
  const router = useRouter()

  const postClick = (post: TPost) =>
    router.push(`/${pu(post).username}/promptories/${post._id as string}`)
  return (
    <CardContent
      role={type === "posts" ? "button" : undefined}
      onClick={type === "posts" ? () => postClick(post) : undefined}
      className={`border-0 p-0`}
    >
      <div className="relative mb-2 overflow-hidden">
        <PostContentType type={type} content={post.caption} />
      </div>
      <div className="relative overflow-hidden">
        <div className="rounded-t-lg border border-b-0 bg-secondary p-2">
          {post.prompt.media?.url ? (
            <div className="flex gap-4">
              <div className="w-auto">
                <PromptoryMedia
                  mediaType={post.prompt.media?.type}
                  mediaUrl={post.prompt.media?.url}
                  prType="prompt"
                />
              </div>
              <div className="self-center">
                <p>Response Made with Media</p>
              </div>
            </div>
          ) : (
            <PostContentType type={type} content={post.prompt.text as string} />
          )}
        </div>
      </div>
      <div className="relative overflow-hidden">
        {post.response.media?.url ? (
          <PromptoryMedia
            mediaType={post.response.media?.type}
            mediaUrl={post.response.media?.url}
            prType="response"
          />
        ) : (
          <div className="rounded-b-lg border border-t-0 p-2">
            <PostContentType
              type={type}
              content={post.response.text as string}
            />
          </div>
        )}
      </div>
    </CardContent>
  )
}

export function PostFooter({ post }: { post: TPost }) {
  const [open, setOpen] = useState(false)

  return (
    <CardFooter className={`flex justify-between p-0 pt-2`}>
      <div className="flex-between w-2/3">
        <PostReplyDialog post={post} />
        <LikeButton post={post} />
        <BookmarkButton post={post} />
        <PostViews post={post} />
      </div>
      <div className="flex gap-4">
        {post.tags.length > 0 && (
          <PostTagsDialog tags={post.tags} open={open} setOpen={setOpen} />
        )}

        <PostIconButton onClick={() => handlePostShare(post)}>
          <Share2 className="size-4" />
          <span className="sr-only">Share Post</span>
        </PostIconButton>
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

export function PromptoryMedia({
  mediaType,
  mediaUrl,
  prType,
}: {
  mediaType: "image" | "video"
  mediaUrl: string
  prType: "prompt" | "response"
}) {
  return (
    <div className="w-full">
      {mediaType === "image" ? (
        <Image
          src={mediaUrl}
          width={500}
          height={500}
          quality={75}
          priority={true}
          className={`${prType === "prompt" ? "h-20 w-auto rounded-lg border border-muted-foreground" : "w-full rounded-b-lg border-t-0"} border`}
          alt="promptory image"
        />
      ) : (
        <video
          src={mediaUrl}
          className={`${prType === "prompt" ? "rounded-t-lg" : "w-full rounded-b-lg"}`}
        />
      )}
    </div>
  )
}
