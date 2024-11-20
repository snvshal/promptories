import SinglePostPage from "@/components/post/content"
import { TPost, TUser } from "@/types/schema.type"
import { getPostById } from "@/utils/get-posts"
import { ps } from "@/utils/ps"
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: { username: string; promptory_id: string }
}): Promise<Metadata> {
  const { username, promptory_id } = params
  const promptory = await getPostById(promptory_id)
  const user = promptory?.user as TUser

  return {
    title: `${user?.name}: ${promptory?.caption || "Promptory"}`,
    description:
      promptory?.caption ||
      `Discover the AI prompt created by @${username} on Promptories.`,
  }
}

export default async function PromptoriesPage({
  params,
}: {
  params: { promptory_id: string }
}) {
  const post = await getPostById(params.promptory_id)

  if (!post) {
    return (
      <main className="main-content flex size-full">
        <div className="flex-center mt-40 w-full">
          <p>Post not found!</p>
        </div>
      </main>
    )
  }

  return <SinglePostPage post={ps(post as TPost)} />
}
