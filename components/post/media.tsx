"use client"

import Image from "next/image"
import { AvatarComponent } from "./content"
import { TPost } from "@/types/schema.type"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { pu } from "@/utils/ps"

export function PromptoryMedia({
  post,
  mediaUrl,
}: {
  post: TPost
  mediaUrl: string
}) {
  const router = useRouter()

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex-between z-20 border-b bg-background px-4 py-2">
        <div className="flex-start gap-2">
          <AvatarComponent user={pu(post)} />
          <p className="font-semibold">{pu(post).name}</p>
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
        <Image
          src={mediaUrl}
          alt="Photo"
          width={800}
          height={600}
          className="h-auto max-h-80 w-auto"
        />
      </div>
    </div>
  )
}
