"use client"

import { memo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Copy,
  Check,
  SquareParkingIcon,
  User,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { NavigateBackHeader } from "../home"
import { TimeAgo } from "../time-ago"
import { TPost, TReplies, TUser } from "@/types/schema.type"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PostFooter, PostIconButton } from "./footer"
import { PostOptions } from "./option"
import { PostReplies, PostReplyDialog } from "./reply"
import { cl, getSortedReplies, postPathname, pu } from "@/utils/ps"
import clsx from "clsx"
import { SetAction } from "@/types/generics.type"
// import { ProfileHoverCard } from "../profile/user"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ToolTipComponent } from "../ui/tooltip"

export const SinglePostPage = memo(({ post }: { post: TPost }) => {
  const sortedReplies = getSortedReplies(post.replies)
  const [postReplies, setPostReplies] = useState(sortedReplies)

  return (
    <div className="w-full">
      <NavigateBackHeader page="Promptory" />
      <main className="main-content">
        <PostType post={post} type="post" setPostReplies={setPostReplies} />
        <PostReplies
          post={post}
          postReplies={postReplies}
          setPostReplies={setPostReplies}
        />
      </main>
      <PostReplyDialog post={post} setPostReplies={setPostReplies}>
        <Button
          size="icon"
          name="Reply Promptory"
          className="compose-button hover:bg-orange-700"
          aria-label="Reply Promptory"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </PostReplyDialog>
    </div>
  )
})

export const PostType = memo(
  ({
    post,
    type,
    setPostReplies,
  }: {
    type: "post" | "posts"
    post: TPost
    setPostReplies?: SetAction<TReplies[]>
  }) => {
    const router = useRouter()
    const visitPost = () => router.push(postPathname(post))

    return (
      <Card
        role={type === "posts" ? "button" : undefined}
        onClick={type === "posts" ? visitPost : undefined}
        className="mid-width-card-content flex px-4 py-3 shadow-none"
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
          <PostFooter post={post} setPostReplies={setPostReplies} />
        </div>
      </Card>
    )
  },
)

export function AvatarComponent({
  user,
  classname,
  size,
}: {
  user: TUser | { username?: string; name?: string; avatar: string }
  classname?: string
  size?: `size-${number}`
}) {
  const router = useRouter()
  const { username, name, avatar } = user
  const visitProfile = () => username && router.push(cl(username))

  return (
    <Avatar
      role="button"
      onClick={(e) => {
        e.stopPropagation()
        visitProfile()
      }}
      className={clsx("cursor-pointer", classname)}
      aria-label={user.name}
    >
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>
        <User className={clsx(size ?? "size-5", "text-muted-foreground")} />
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
  const [showMore, setShowMore] = useState(false)

  if (type === "post" || showMore) {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    )
  } else {
    return (
      <>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content.split(" ").slice(0, 50).join(" ")}
          </ReactMarkdown>
        </div>
        {content.split(" ").length > 50 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMore(true)
            }}
            className="text-blue-500 hover:underline"
          >
            Show more
          </button>
        )}
      </>
    )
  }
}

export type PostContentProps = { type: "post" | "posts"; post: TPost }

export function PostHeader({ type, post }: PostContentProps) {
  return (
    <CardHeader onClick={(e) => e.stopPropagation()} className="p-0">
      <div
        className={`${type === "post" ? "mb-4" : "h-5"} flex-between relative`}
      >
        <div className="flex-start flex-1">
          {type === "post" && (
            <div className="mr-2">
              <AvatarComponent user={pu(post)} />
            </div>
          )}
          <PostAuthorName type={type} post={post} />
          {type === "posts" && (
            <span className="text-muted-foreground">
              <span className="px-1">&#183;</span>
              <span className="max-sm:text-sm">
                <TimeAgo timestamp={post.createdAt as Date} />
              </span>
            </span>
          )}
        </div>
        <div className="absolute -right-2 -top-1 flex">
          <PostPromptSheet post={post} />
          <PostOptions post={post} type={type} />
        </div>
      </div>
    </CardHeader>
  )
}

export function PostPromptSheet({ post }: { post: TPost }) {
  return (
    <Sheet>
      <ToolTipComponent content="Prompt">
        <SheetTrigger asChild>
          <PostIconButton className="hover:bg-orange-500/10 hover:text-orange-500">
            <SquareParkingIcon className="h-4 w-4" />
          </PostIconButton>
        </SheetTrigger>
      </ToolTipComponent>
      <SheetContent className="p-0 max-sm:w-full">
        <SheetHeader className="flex-row items-center justify-between space-y-0 p-6 pb-0">
          <SheetTitle>Prompt</SheetTitle>
          <SheetDescription></SheetDescription>
          <CopyButton text={post.prompt.text as string} />
        </SheetHeader>
        <div className="mt-2 max-h-[calc(100dvh-4.5rem)] overflow-y-auto p-6 pt-0">
          <div className="prose prose-sm mb-2 max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.prompt.text as string}
            </ReactMarkdown>
          </div>
          {post.prompt.media?.url && (
            <Link
              href={postPathname(post, "prompt", "media")}
              onClick={(e) => e.stopPropagation()}
            >
              <PostMedia
                mediaType={post.prompt.media?.type}
                mediaUrl={post.prompt.media?.url}
                caption={post.caption}
                prType="prompt"
              />
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function PostAuthorName({
  type,
  post,
}: {
  type: "post" | "posts"
  post: TPost
}) {
  if (type === "post") {
    return (
      // <ProfileHoverCard profileUser={pu(post)}>
      <Link
        href={cl(pu(post).username)}
        className="flex cursor-pointer flex-col gap-1"
      >
        <p className="font-semibold leading-4 hover:underline">
          {pu(post).name}
        </p>
        <p className="leading-4 text-muted-foreground">
          &#64;{pu(post).username}
        </p>
      </Link>
      // </ProfileHoverCard>
    )
  } else {
    return (
      // <ProfileHoverCard profileUser={pu(post)}>
      <Link
        href={cl(pu(post).username)}
        className="flex cursor-pointer items-center justify-start gap-1"
      >
        <p className="font-semibold hover:underline max-sm:hidden">
          {pu(post).name}
        </p>
        <p className="max-sm:font-semibold sm:text-muted-foreground">
          <span className="max-sm:hidden">&#64;</span>
          {pu(post).username}
        </p>
      </Link>
      // </ProfileHoverCard>
    )
  }
}

export function PostTime({ createdAt }: { createdAt: Date }) {
  return (
    <div className="flex-start border-b py-3 text-muted-foreground">
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
  return (
    <CardContent className="border-0 p-0">
      <div className="relative overflow-hidden">
        <PostContentType type={type} content={post.caption} />
      </div>
      {/* <div
        className={`relative flex flex-col gap-4 overflow-hidden rounded-lg bg-primary-foreground p-2`}
      > */}
      <div>
        {post.response.media?.url ? (
          <Link
            href={postPathname(post, "response", "media")}
            onClick={(e) => e.stopPropagation()}
          >
            <PostMedia
              mediaType={post.response.media?.type}
              mediaUrl={post.response.media?.url}
              caption={post.caption}
              prType="response"
            />
          </Link>
        ) : (
          <PostContentType type={type} content={post.response.text as string} />
        )}
      </div>
      {/* </div> */}
    </CardContent>
  )
}

export function PostMedia({
  mediaType,
  mediaUrl,
  prType,
  caption,
}: {
  mediaType: "image" | "video"
  mediaUrl: string
  prType: "prompt" | "response"
  caption: string
}) {
  return (
    <div className="mt-3 w-full">
      {mediaType === "image" ? (
        <>
          <Image
            src={mediaUrl}
            width={500}
            height={500}
            quality={75}
            priority={true}
            className="w-full rounded-lg"
            alt="promptory image"
            aria-describedby="image-description"
          />
          <span id="image-description" className="sr-only">
            {caption}
          </span>
        </>
      ) : (
        <>
          <video
            src={mediaUrl}
            controls={true}
            className="w-full rounded-lg"
            aria-describedby="video-description"
            aria-label={`${prType} ${mediaType}`}
          >
            Your browser does not support the video tag.
          </video>
          <span id="video-description" className="sr-only">
            {caption}
          </span>
        </>
      )}
    </div>
  )
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  return (
    <ToolTipComponent content={copied ? "Copied!" : "Copy"}>
      <Button size="icon" variant="ghost" onClick={handleCopy}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </ToolTipComponent>
  )
}
