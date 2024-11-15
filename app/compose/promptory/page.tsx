import PostForm from "@/components/form"
import { defaultValues, postMedia } from "@/lib/constants"

export default function CreatePromptory() {
  return (
    <PostForm
      defaultFormValues={defaultValues}
      operationType="POST"
      media={postMedia}
    />
  )
}
