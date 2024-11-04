"use client"

import React, { useState, useCallback } from "react"
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
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"

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

const formSchema = z
  .object({
    caption: z.string().min(1, "Caption is required"),
    model_url: z.string().url("Invalid model URL").min(10, "Model is required"),
    chat_link: z.string().url("Invalid chat URL").optional().or(z.literal("")),
    prompt: z.string().optional(),
    prompt_media: mediaSchema.optional(),
    response: z.string().optional(),
    response_media: mediaSchema.optional(),
    promptory_type: z.enum(promptory_types as [string, ...string[]], {
      required_error: "Please select a promptory type",
    }),
    tags: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.promptory_type.toLowerCase().startsWith("text")) {
        return !!data.prompt
      } else {
        return !!data.prompt_media
      }
    },
    {
      message: "Prompt is required based on the selected promptory type",
      path: ["prompt"],
    },
  )
  .refine(
    (data) => {
      if (data.promptory_type.toLowerCase().endsWith("text")) {
        return !!data.response
      } else {
        return !!data.response_media
      }
    },
    {
      message: "Response is required based on the selected promptory type",
      path: ["response"],
    },
  )

export type FormValues = z.infer<typeof formSchema>

export type MediaType = "image" | "video"

export default function PostForm({
  defaultValues,
  operationType,
  post,
  media,
}: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [promptMediaUrl, setPromptMediaUrl] = useState<string | null>(
    media?.prompt.url as string,
  )
  const [promptMediaType, setPromptMediaType] = useState<MediaType | null>(
    media?.prompt.type as MediaType,
  )
  const [responseMediaUrl, setResponseMediaUrl] = useState<string | null>(
    media?.response.url as string,
  )
  const [responseMediaType, setResponseMediaType] = useState<MediaType | null>(
    media?.response.type as MediaType,
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const promptoryType = watch("promptory_type")
  const isPromptText = promptoryType?.toLowerCase().startsWith("text")
  const isResponseText = promptoryType?.toLowerCase().endsWith("text")

  const router = useRouter()

  const postRoute = useCallback(
    (post: TPost) =>
      router.push(`/${pu(post).username}/promptories/${post._id as string}`),
    [router],
  )

  const handleUploadSuccess = useCallback(
    (
      result: CloudinaryUploadWidgetResults,
      mediaType: "prompt" | "response",
    ) => {
      const info = result.info as {
        secure_url: string
        resource_type: string
        format: string
        bytes: number
      }

      if (info.bytes > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "File size exceeds 5MB limit.",
          variant: "destructive",
        })
        return
      }

      const fileType = `${info.resource_type}/${info.format}`
      if (
        !ACCEPTED_IMAGE_TYPES.includes(fileType) &&
        !ACCEPTED_VIDEO_TYPES.includes(fileType)
      ) {
        toast({
          title: "Error",
          description:
            "Unsupported file type. Please upload a valid image or video file.",
          variant: "destructive",
        })
        return
      }

      const mediaData = {
        url: info.secure_url,
        type: info.resource_type as MediaType,
      }
      if (mediaType === "prompt") {
        setPromptMediaUrl(info.secure_url)
        setPromptMediaType(info.resource_type as MediaType)
        setValue("prompt_media", mediaData)
      } else {
        setResponseMediaUrl(info.secure_url)
        setResponseMediaType(info.resource_type as MediaType)
        setValue("response_media", mediaData)
      }
    },
    [setValue],
  )

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const formData = {
        ...data,
        prompt_media:
          promptMediaUrl && promptMediaType && !isPromptText
            ? { url: promptMediaUrl, type: promptMediaType }
            : undefined,
        response_media:
          responseMediaUrl && responseMediaType && !isResponseText
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
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was a problem sending your post.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                    Prompt{" "}
                    {promptoryType?.toLowerCase().startsWith("image")
                      ? "Image"
                      : promptoryType?.toLowerCase().startsWith("video")
                        ? "Video"
                        : "Audio as Video"}
                  </Label>
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                    options={{
                      maxFiles: 1,
                      resourceType: "auto",
                      clientAllowedFormats: [
                        ...ACCEPTED_IMAGE_TYPES,
                        ...ACCEPTED_VIDEO_TYPES,
                      ],
                      maxFileSize: MAX_FILE_SIZE,
                    }}
                    onSuccess={(result) =>
                      handleUploadSuccess(result, "prompt")
                    }
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        className="w-full"
                      >
                        Upload Prompt Media
                      </Button>
                    )}
                  </CldUploadWidget>
                  {promptMediaUrl && promptMediaType && (
                    <div className="mt-4">
                      <RenderPreview
                        mediaUrl={promptMediaUrl}
                        mediaType={promptMediaType}
                      />
                    </div>
                  )}
                  {!promptMediaUrl && errors.prompt && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.prompt.message || "Prompt media is required"}
                    </p>
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
                    Response{" "}
                    {promptoryType?.toLowerCase().endsWith("image")
                      ? "Image"
                      : promptoryType?.toLowerCase().endsWith("video")
                        ? "Video"
                        : "Audio as Video"}
                  </Label>
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                    options={{
                      maxFiles: 1,
                      resourceType: "auto",
                      clientAllowedFormats: [
                        ...ACCEPTED_IMAGE_TYPES,
                        ...ACCEPTED_VIDEO_TYPES,
                      ],
                      maxFileSize: MAX_FILE_SIZE,
                    }}
                    onSuccess={(result) =>
                      handleUploadSuccess(result, "response")
                    }
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        className="w-full"
                      >
                        Upload Response Media
                      </Button>
                    )}
                  </CldUploadWidget>
                  {responseMediaUrl && responseMediaType && (
                    <div className="mt-4">
                      <RenderPreview
                        mediaUrl={responseMediaUrl}
                        mediaType={responseMediaType}
                      />
                    </div>
                  )}
                  {!responseMediaUrl && errors.response && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.response.message || "Response media is required"}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Separator orientation="vertical" className="h-auto" />

            <div className="w-1/3 space-y-6">
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
                      placeholder="Enter model URL"
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
                  Enter full URL of the website where we can try it. (e.g.,
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
                    {errors.chat_link.message}
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

const RenderPreview: React.FC<{ mediaUrl: string; mediaType: MediaType }> = ({
  mediaUrl,
  mediaType,
}) => {
  if (!mediaUrl) return null

  if (mediaType === "image") {
    return (
      <Image
        src={mediaUrl}
        alt="Uploaded image"
        width={300}
        height={200}
        className="mt-2 h-auto w-full rounded-lg"
      />
    )
  }

  if (mediaType === "video") {
    return (
      <video src={mediaUrl} controls className="mt-2 h-auto w-full rounded-lg">
        Your browser does not support the video tag.
      </video>
    )
  }

  return <p>Unsupported media type</p>
}
