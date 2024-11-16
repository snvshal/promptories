"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import Link from "next/link"
import { NavigateBackHeader } from "../home"
import { TimeAgo } from "../time-ago"
import { TPost, TUser } from "@/types/schema.type"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PostFooter } from "./footer"
import { PostOptions } from "./option"
import { PostReplies, PromptoryReplyButton } from "./reply"
import { pu } from "@/utils/ps"

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
    return <p className="whitespace-pre-wrap">{content}</p>
  } else {
    return (
      <>
        <p className="whitespace-pre-wrap">
          {content.split(" ").slice(0, 40).join(" ")}
        </p>
        {content.split(" ").length > 40 && (
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

  const postUrl = `/${pu(post).username}/promptories/${post._id as string}`
  const postClick = () => router.push(postUrl)

  const mt = ["image", "video", "audio"]
  const pt = post.promptory_type.toLowerCase()
  const matchedType = mt.find((type) => pt.startsWith(type))

  return (
    <CardContent
      role={type === "posts" ? "button" : undefined}
      onClick={type === "posts" ? postClick : undefined}
      className={`border-0 p-0`}
    >
      <div className="relative mb-2 overflow-hidden">
        <PostContentType type={type} content={post.caption} />
      </div>
      <div className="relative overflow-hidden">
        <div className="rounded-t-lg border border-b-0 bg-primary-foreground p-2 px-3">
          {post.prompt.media?.url ? (
            <div className="my-1 flex gap-4">
              <div className="w-auto">
                <Link
                  href={`/${pu(post).username}/promptories/${post._id as string}/prompt/media`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <PostMedia
                    mediaType={post.prompt.media?.type}
                    mediaUrl={post.prompt.media?.url}
                    prType="prompt"
                  />
                </Link>
              </div>
              <div className="flex-1 self-center">
                <p className="text-muted-foreground">
                  Response created using this {matchedType}
                </p>
              </div>
            </div>
          ) : (
            <PostContentType type={type} content={post.prompt.text as string} />
          )}
        </div>
      </div>
      <div className="relative overflow-hidden">
        {post.response.media?.url ? (
          <Link
            href={`/${pu(post).username}/promptories/${post._id as string}/response/media`}
            onClick={(e) => e.stopPropagation()}
          >
            <PostMedia
              mediaType={post.response.media?.type}
              mediaUrl={post.response.media?.url}
              prType="response"
            />
          </Link>
        ) : (
          <div className="rounded-b-lg border border-t-0 p-2 px-3">
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

export function PostMedia({
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
          className={`${prType === "prompt" ? "h-20 w-auto rounded-lg" : "w-full rounded-b-lg border-t-0"} border`}
          alt="promptory image"
        />
      ) : (
        <video
          src={mediaUrl}
          className={`${prType === "prompt" ? "h-20 w-auto rounded-lg" : "w-full rounded-b-lg border-t-0"} border`}
          controls={prType === "prompt" ? false : true}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}
