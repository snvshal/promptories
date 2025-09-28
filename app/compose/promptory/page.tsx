import PostForm from "@/components/form"
import { defaultValues, postMedia } from "@/lib/constants"
import { ps } from "@/utils/ps"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compose Promptory",
  description:
    "Start creating a new promptory. Share your best AI prompts, get responses, and save them for future reference on Promptories.",
  openGraph: {
    title: "Compose Promptory — Share Your AI Creativity",
    description:
      "Draft and share your creative AI prompts with the Promptories community.",
    url: `${process.env.METADATA_BASE_URL}/compose/promptory`,
    siteName: "Promptories",
    type: "article",
  },
  twitter: {
    title: "Compose Promptory — Share Your AI Prompts",
    description: "Craft and share your AI prompts easily with Promptories.",
    card: "summary_large_image",
  },
}

export default function CreatePromptory() {
  return (
    <PostForm
      defaultFormValues={ps(defaultValues)}
      operationType="POST"
      media={ps(postMedia)}
    />
  )
}
