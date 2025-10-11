"use client"

import { memo } from "react"
import Image from "next/image"
import { AvatarComponent } from "./content"
import { TPost } from "@/types/schema.type"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { cl, pu } from "@/utils/ps"
import { MediaType } from "../form"
import Link from "next/link"

export const PromptoryMedia = memo(
  ({
    post,
    mediaUrl,
    mediaType,
    prompt_response,
  }: {
    post: TPost
    mediaUrl: string
    mediaType: MediaType
    prompt_response: "prompt" | "response"
  }) => {
    const router = useRouter()
    return (
      <div className="flex h-dvh w-full flex-col">
        <header className="flex-between z-20 border-b bg-background px-4 py-3">
          <div className="flex-start gap-2">
            <AvatarComponent user={pu(post)} />
            <Link
              href={cl(pu(post).username)}
              className="font-semibold hover:underline"
            >
              {pu(post).name}
            </Link>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => router.back()}
            className="rounded-full"
            aria-label="Close Media"
            name="CloseButton"
          >
            <X size={20} />
          </Button>
        </header>
        <div className="flex-center h-[calc(100dvh-4rem)]">
          {mediaType === "image" ? (
            <>
              <Image
                role="img"
                src={mediaUrl}
                width={1200}
                height={600}
                priority={true}
                className="max-h-[80vh] max-w-full object-contain"
                alt={`This is a ${prompt_response} ${mediaType} created by @${pu(post).username}`}
                aria-describedby="image-description"
              />

              <span id="image-description" className="sr-only">
                {post.caption}
              </span>
            </>
          ) : (
            <>
              <video
                src={mediaUrl}
                className="max-h-[80vh] max-w-full object-contain"
                controls
                aria-describedby="video-description"
                aria-label={`${prompt_response} ${mediaType}`}
              >
                Your browser does not support the video tag.
              </video>

              <span id="video-description" className="sr-only">
                {post.caption}
              </span>
            </>
          )}
        </div>
      </div>
    )
  },
)
