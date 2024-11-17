"use client"

import Image from "next/image"
import { AvatarComponent } from "./content"
import { TPost } from "@/types/schema.type"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { cl, pu } from "@/utils/ps"
import { MediaType } from "../form"
import Link from "next/link"

export function PromptoryMedia({
  post,
  mediaUrl,
  mediaType,
}: {
  post: TPost
  mediaUrl: string
  mediaType: MediaType
}) {
  const router = useRouter()

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex-between z-20 border-b bg-background px-4 py-2">
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
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <X size={20} />
        </Button>
      </header>
      <div className="flex-center h-[calc(100vh-4rem)]">
        {mediaType === "image" ? (
          <Image
            src={mediaUrl}
            alt="Photo"
            width={800}
            height={600}
            className="h-auto max-h-80 w-auto"
          />
        ) : (
          <video src={mediaUrl} className="h-auto max-h-80 w-auto" controls>
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  )
}
