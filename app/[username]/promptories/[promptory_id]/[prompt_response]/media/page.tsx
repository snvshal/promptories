import { MediaType } from "@/components/form"
import { PromptoryMedia } from "@/components/post/media"
import { getPostById } from "@/utils/get-posts"
import { ps } from "@/utils/ps"

export default async function PromptoryMediaPage({
  params,
}: {
  params: {
    username: string
    promptory_id: string
    prompt_response: "response" | "prompt"
  }
}) {
  const { promptory_id, prompt_response } = params
  const post = await getPostById(promptory_id)

  if (!post) return <div className="flex-center h-screen">Photo not found</div>

  const mediaUrl = post[prompt_response]?.media?.url
  const mediaType = post[prompt_response]?.media?.type
  if (!mediaUrl)
    return <div className="flex-center h-screen">Photo not found</div>

  return (
    <PromptoryMedia
      post={ps(post)}
      mediaUrl={mediaUrl}
      mediaType={mediaType as MediaType}
    />
  )
}
