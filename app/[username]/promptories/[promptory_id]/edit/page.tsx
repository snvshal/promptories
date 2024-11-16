import PostForm from "@/components/form"
import { TPost } from "@/types/schema.type"
import { getPostById, updatePostValues } from "@/utils/get-posts"
import { ps } from "@/utils/ps"
import { Metadata } from "next"

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
  const post = await getPostById(params.promptory_id)
  const { postValues, editPostMedia } = updatePostValues(post as TPost)
  return (
    <PostForm
      defaultFormValues={postValues}
      operationType="PATCH"
      post={ps(post as TPost)}
      media={ps(editPostMedia)}
    />
  )
}
