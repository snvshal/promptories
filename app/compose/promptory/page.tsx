import PostForm from "@/components/form"
import { defaultValues, postMedia } from "@/lib/constants"

export default function CreatePromptory() {
  return (
    <PostForm
      defaultValues={defaultValues}
      operationType="POST"
      media={postMedia}
    />
  )
}
