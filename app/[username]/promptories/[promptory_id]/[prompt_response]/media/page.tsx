import { getPostMediaById } from "@/utils/get-posts"
import Image from "next/image"

export default async function PhotoPage({
  params,
}: {
  params: {
    username: string
    promptory_id: string
    prompt_response: "response" | "prompt"
    photoId: string
  }
}) {
  const { promptory_id, prompt_response } = params
  const media = await getPostMediaById(promptory_id, prompt_response)

  if (!media) return <div>Photo not found</div>

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Image
        src={media.url}
        alt="Photo"
        width={800}
        height={600}
        className="h-72 w-auto"
      />
    </div>
  )
}
