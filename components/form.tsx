"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { promptory_types } from "@/lib/constants"
import { savePostForm, updatePostForm } from "@/actions/postFormActions"
import { NavigateBackHeader } from "./post"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { pu } from "./home"
import { PostFormProps } from "@/types/props.type"
import { ToastAction } from "./ui/toast"
import { TPost } from "@/types/schema.type"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { CldUploadWidget } from "next-cloudinary"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"]

const mediaSchema = z.object({
  url: z.string().url(),
  type: z.enum(["image", "video"]),
})

const formSchema = z.object({
  caption: z.string().min(1, "Caption is required"),
  model_url: z.string().url("Invalid model URL").min(10, "Model is required"),
  chat_link: z.string().url("Invalid chat URL").optional().or(z.literal("")),
  prompt: z.string().min(1, "Prompt is required"),
  promptMedia: mediaSchema.optional(),
  response: z.string().min(1, "Response is required"),
  responseMedia: mediaSchema.optional(),
  promptory_type: z.enum(promptory_types as [string, ...string[]], {
    required_error: "Please select a promptory type",
  }),
  tags: z.string().optional(),
})

export type FormValues = z.infer<typeof formSchema>

type MediaType = "image" | "video" | null

export default function PostForm({
  defaultValues,
  operationType,
  post,
}: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [promptMediaUrl, setPromptMediaUrl] = useState<string | null>(null)
  const [promptMediaType, setPromptMediaType] = useState<MediaType>(null)
  const [responseMediaUrl, setResponseMediaUrl] = useState<string | null>(null)
  const [responseMediaType, setResponseMediaType] = useState<MediaType>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const promptoryType = watch("promptory_type")
  const router = useRouter()

  const postRoute = (post: TPost) =>
    router.push(`/${pu(post).username}/promptories/${post._id as string}`)

  const handleUploadSuccess = (
    result: any,
    mediaType: "prompt" | "response",
  ) => {
    const info = result.info as { secure_url: string; resource_type: MediaType }
    if (mediaType === "prompt") {
      setPromptMediaUrl(info.secure_url)
      setPromptMediaType(info.resource_type as MediaType)
    } else {
      setResponseMediaUrl(info.secure_url)
      setResponseMediaType(info.resource_type as MediaType)
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const formData = {
        ...data,
        promptMedia:
          promptMediaUrl && promptMediaType
            ? { url: promptMediaUrl, type: promptMediaType }
            : undefined,
        responseMedia:
          responseMediaUrl && responseMediaType
            ? { url: responseMediaUrl, type: responseMediaType }
            : undefined,
      }

      if (operationType === "POST") {
        const post: TPost = await savePostForm(formData)
        router.push("/home")
        toast({
          description: "Your post has been sent.",
          action: (
            <ToastAction
              onClick={() => postRoute(post)}
              altText="Goto schedule to undo"
            >
              View
            </ToastAction>
          ),
        })
      } else if (operationType === "PATCH" && post) {
        await updatePostForm(formData, post._id as string)
        postRoute(post)
        toast({
          description: "Your post has been updated.",
        })
      }
      reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your post.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPromptText = promptoryType?.toLowerCase().startsWith("text-")
  const isResponseText = promptoryType?.toLowerCase().endsWith("-text")

  return (
    <div className="min-h-screen w-full">
      <NavigateBackHeader
        page={operationType === "POST" ? "Create Promptory" : "Edit Promptory"}
      />
      <main className="main-content p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1 space-y-6">
              <div>
                <Label htmlFor="promptory_type">Promptory Type</Label>
                <Controller
                  name="promptory_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="promptory_type">
                        <SelectValue placeholder="Select a promptory type" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {promptory_types.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.promptory_type && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.promptory_type.message}
                  </p>
                )}
              </div>

              {isPromptText ? (
                <div>
                  <Label htmlFor="prompt">Prompt</Label>
                  <Controller
                    name="prompt"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="prompt"
                        placeholder="Enter prompt"
                        {...field}
                      />
                    )}
                  />
                  {errors.prompt && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.prompt.message}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <Label htmlFor="promptMedia">
                    Prompt Media (Image or Video)
                  </Label>
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                    options={{
                      maxFiles: 1,
                      resourceType: "auto",
                    }}
                    onSuccess={(result) =>
                      handleUploadSuccess(result, "prompt")
                    }
                  >
                    {({ open }) => (
                      <Button onClick={() => open()} className="w-full">
                        Upload Image or Video
                      </Button>
                    )}
                  </CldUploadWidget>
                  {promptMediaUrl && promptMediaType && (
                    <div className="mt-4">
                      <h3 className="mb-2 text-lg font-semibold">Preview:</h3>
                      <RenderPreview
                        mediaUrl={promptMediaUrl}
                        mediaType={promptMediaType}
                      />
                    </div>
                  )}
                </div>
              )}

              {isResponseText ? (
                <div>
                  <Label htmlFor="response">Response</Label>
                  <Controller
                    name="response"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="response"
                        placeholder="Enter response"
                        {...field}
                      />
                    )}
                  />
                  {errors.response && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.response.message}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <Label htmlFor="responseMedia">
                    Response Media (Image or Video)
                  </Label>
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                    options={{
                      maxFiles: 1,
                      resourceType: "auto",
                    }}
                    onSuccess={(result) =>
                      handleUploadSuccess(result, "response")
                    }
                  >
                    {({ open }) => (
                      <Button onClick={() => open()} className="w-full">
                        Upload Image or Video
                      </Button>
                    )}
                  </CldUploadWidget>
                  {responseMediaUrl && responseMediaType && (
                    <div className="mt-4">
                      <h3 className="mb-2 text-lg font-semibold">Preview:</h3>
                      <RenderPreview
                        mediaUrl={responseMediaUrl}
                        mediaType={responseMediaType}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator orientation="vertical" className="h-auto" />

            <div className="flex-1 space-y-6">
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Controller
                  name="caption"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="caption"
                      placeholder="Enter caption"
                      {...field}
                    />
                  )}
                />
                {errors.caption && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.caption.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="model_url">Model</Label>
                <Controller
                  name="model_url"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="model_url"
                      placeholder="Enter model"
                      {...field}
                    />
                  )}
                />
                {errors.model_url && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.model_url.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Enter full url of the website where we can try it. (e.g.,
                  https://example.com)
                </p>
              </div>

              <div>
                <Label htmlFor="chat_link">Chat</Label>
                <Controller
                  name="chat_link"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="chat_link"
                      placeholder="Enter chat link"
                      {...field}
                    />
                  )}
                />
                {errors.chat_link && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.chat_link?.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Enter public chat link of this promptory
                </p>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="tags"
                      placeholder="Enter tags (space-separated)"
                      {...field}
                    />
                  )}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter tags separated by space (e.g., tag1 tag2 tag3)
                </p>
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.tags?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator orientation="horizontal" />

          <div className="flex w-full gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

const RenderPreview = ({
  mediaUrl,
  mediaType,
}: {
  mediaUrl: string
  mediaType: MediaType
}) => {
  if (!mediaUrl) return null

  if (mediaType === "image") {
    return (
      <Image
        src={mediaUrl}
        alt="Uploaded image"
        width={300}
        height={200}
        className="mt-2 h-auto max-w-full rounded-lg"
      />
    )
  }

  if (mediaType === "video") {
    return (
      <video
        src={mediaUrl}
        controls
        className="mt-2 h-auto max-w-full rounded-lg"
      >
        Your browser does not support the video tag.
      </video>
    )
  }

  return <p>Unsupported media type</p>
}
