import PostForm from "@/components/form"
import { NavigateBackHeader } from "@/components/home"
import { TPost } from "@/types/schema.type"
import { getPostById, updatePostValues } from "@/utils/get-posts"
import { currentUser } from "@/utils/get-user"
import { ps } from "@/utils/ps"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit Promptory",
  description:
    "Make changes to your promptory. Refine your AI prompt for better results and insights.",
}

export default async function UpdatePromptory({
  params,
}: {
  params: { promptory_id: string }
}) {
  const user = await currentUser()
  const post = await getPostById(params.promptory_id)

  if (user?._id?.toString() !== post?.user._id?.toString()) return notFound()

  if (!post) {
    return (
      <main className="main-content">
        <NavigateBackHeader page="Edit Promptory" />
        <div className="flex-center mt-40">
          <p className="text-xl font-semibold">Promptory not found!</p>
        </div>
      </main>
    )
  }

  const { postValues, editPostMedia } = updatePostValues(post as TPost)
  return (
    <PostForm
      defaultFormValues={ps(postValues)}
      operationType="PATCH"
      post={ps(post as TPost)}
      media={ps(editPostMedia)}
    />
  )
}
