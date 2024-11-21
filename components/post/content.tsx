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
import { cl, postPathname, pu } from "@/utils/ps"
import clsx from "clsx"

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
        <PostFooter post={post} />
      </div>
    </Card>
  )
}

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
  if (type === "post") {
    return <p className="whitespace-pre-wrap text-lg">{content}</p>
  } else {
    return (
      <>
        <p className="whitespace-pre-wrap">
          {content.split(" ").slice(0, 40).join(" ")}
        </p>
        {content.split(" ").length > 40 && (
          <span className="text-blue-500 hover:underline">Show more</span>
        )}
      </>
    )
  }
}

export type PostContentProps = { type: "post" | "posts"; post: TPost }

export function PostHeader({ type, post }: PostContentProps) {
  return (
    <CardHeader onClick={(e) => e.stopPropagation()} className="p-0">
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
      <Link
        href={cl(postAuthor.username)}
        className="flex cursor-pointer flex-col gap-0"
      >
        <p className="font-semibold hover:underline">{postAuthor.name}</p>
        <p className="leading-4 text-muted-foreground">
          &#64;{postAuthor.username}
        </p>
      </Link>
    )
  } else {
    return (
      <Link
        href={cl(postAuthor.username)}
        className="flex cursor-pointer items-center justify-start gap-1"
      >
        <p className="font-semibold hover:underline max-sm:hidden">
          {postAuthor.name}
        </p>
        <p className="max-sm:font-semibold sm:text-muted-foreground">
          <span className="max-sm:hidden">&#64;</span>
          {postAuthor.username}
        </p>
      </Link>
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
    <CardContent className={`border-0 p-0`}>
      <div className="relative mb-2 overflow-hidden">
        <PostContentType type={type} content={post.caption} />
      </div>
      <div
        className={`relative flex flex-col gap-4 overflow-hidden rounded-lg bg-primary-foreground p-4`}
      >
        <div>
          <h2 className={`${type === "post" && "text-lg"} font-bold`}>
            Prompt:
          </h2>
          {post.prompt.media?.url ? (
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
          ) : (
            <PostContentType type={type} content={post.prompt.text as string} />
          )}
        </div>
        <div>
          <h2 className={`${type === "post" && "text-lg"} font-bold`}>
            Response:
          </h2>
          {post.response.media?.url ? (
            <Link
              href={postPathname(post, "prompt", "media")}
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
            <PostContentType
              type={type}
              content={post.response.text as string}
            />
          )}
        </div>
      </div>
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
    <div className="w-full">
      {mediaType === "image" ? (
        <>
          <Image
            src={mediaUrl}
            width={500}
            height={500}
            quality={75}
            priority={true}
            className="mt-1.5 w-full rounded-lg"
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
            className="mt-1.5 w-full rounded-lg"
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
