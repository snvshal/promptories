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
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { postPathname } from "@/utils/ps"
import { PostFormProps } from "@/types/props.type"
import { ToastAction } from "./ui/toast"
import { TPost } from "@/types/schema.type"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { Info } from "lucide-react"
import { ToolTipComponent } from "./ui/tooltip"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { NavigateBackHeader } from "./home"
import { usePosts } from "@/hooks/use-posts"

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ACCEPTED_IMAGE_TYPES = [
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
    caption: z.string().optional(),
    model_url: z.string().url("Invalid model URL").optional().or(z.literal("")),
    chat_link: z.string().url("Invalid chat URL").optional().or(z.literal("")),
    prompt: z.string().min(1, "Prompt text is required"),
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
  defaultFormValues,
  operationType,
  post,
  media,
}: PostFormProps) {
  const { setPosts } = usePosts()

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
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultFormValues,
      prompt_media:
        defaultFormValues.prompt_media ||
        (!defaultFormValues.prompt &&
        !defaultFormValues.promptory_type?.startsWith("text")
          ? media?.prompt
          : undefined),
      response_media:
        defaultFormValues.response_media ||
        (!defaultFormValues.response &&
        !defaultFormValues.promptory_type?.endsWith("text")
          ? media?.response
          : undefined),
    },
  })

  const promptoryType = watch("promptory_type")
  const isPromptText = promptoryType?.toLowerCase().startsWith("text")
  const isResponseText = promptoryType?.toLowerCase().endsWith("text")

  const router = useRouter()

  const postRoute = useCallback(
    (post: TPost) => router.push(postPathname(post)),
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

  // const pathname = usePathname()
  // const searchParams = useSearchParams()

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
        const { success, post } = await savePostForm(formData)
        if (success && post) {
          setPosts((posts) => ({
            ...posts,
            following: [post, ...posts.following],
            forYou: [post, ...posts.forYou],
          }))

          router.back()

          toast({
            description: "Your post has been sent.",
            action: (
              <ToastAction
                onClick={() => postRoute(post)}
                altText="View your created post"
              >
                View
              </ToastAction>
            ),
          })
        } else {
          toast({
            title: "Error",
            variant: "destructive",
            description: "Failed to save the post. Try again later.",
          })
        }

        // if (searchParams.get("compose") === "true") {
        //   setOpen?.(false)
        //   router.push(pathname)
        // } else {
        //   router.back()
        // }

        reset()
      } else if (operationType === "PATCH" && post) {
        const { success, updatedPost } = await updatePostForm(
          formData,
          post._id as string,
        )

        console.log(success, updatedPost)
        if (success && updatedPost) {
          setPosts((prev) => ({
            ...prev,
            following: prev.following.map((p) =>
              p._id === post._id ? post : p,
            ),
            forYou: prev.forYou.map((p) => (p._id === post._id ? post : p)),
          }))

          router.back()

          toast({
            description: "Your post has been updated.",
            action: (
              <ToastAction
                onClick={() => postRoute(post)}
                altText="View your updated post"
              >
                View
              </ToastAction>
            ),
          })
        } else {
          toast({
            title: "Error",
            variant: "destructive",
            description: "Failed to update the post. Try again later.",
          })
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const autoResize = (element: HTMLTextAreaElement) => {
    if (element) {
      element.style.height = "auto"
      element.style.height = `${element.scrollHeight + 2}px`
    }
  }

  return (
    <div className="w-full">
      <NavigateBackHeader
        page={operationType === "POST" ? "Create Promptory" : "Edit Promptory"}
      />
      <main className="main-content p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    <SelectTrigger
                      id="promptory_type"
                      className="capitalize text-muted-foreground"
                    >
                      <SelectValue placeholder="Select a promptory type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {promptory_types.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
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

            <div>
              <Label htmlFor="prompt">Prompt Text</Label>
              <Controller
                name="prompt"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="prompt"
                    placeholder="Enter prompt text"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e)
                      autoResize(e.target as HTMLTextAreaElement)
                    }}
                    onBlur={field.onBlur}
                    ref={(element) => {
                      field.ref(element)
                      autoResize(element as HTMLTextAreaElement)
                    }}
                  />
                )}
              />
              {errors.prompt && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.prompt.message}
                </p>
              )}
            </div>

            {!isPromptText && (
              <div>
                <Label htmlFor="promptMedia">
                  Prompt Media (
                  {promptoryType?.toLowerCase().startsWith("image")
                    ? "Image"
                    : "Video"}
                  )
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
                  onSuccess={(result) => handleUploadSuccess(result, "prompt")}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => open()}
                      className="w-full text-muted-foreground"
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

            {isResponseText && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="response">Response (Markdown)</Label>
                  <Controller
                    name="response"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <div className="space-y-4">
                        <Textarea
                          id="response"
                          placeholder="Enter response in Markdown"
                          className="min-h-[200px] text-sm"
                          value={value || ""}
                          onChange={(e) => {
                            onChange(e.target.value)
                            autoResize(e.target as HTMLTextAreaElement)
                          }}
                          {...field}
                        />
                        <div className="rounded-lg border bg-card p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Preview
                            </span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-xs text-muted-foreground">
                              Markdown supported
                            </span>
                          </div>
                          <div className="prose prose-sm max-w-none overflow-auto rounded-md dark:prose-invert prose-pre:bg-muted prose-pre:p-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {value || "_Start typing to see preview..._"}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                  {errors.response && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.response.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!isResponseText && (
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
                      className="w-full text-muted-foreground"
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

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Additional Information (Optional)
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {/* <div>
                  <Label htmlFor="caption">Caption</Label>
                  <Controller
                    name="caption"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="caption"
                        placeholder="Enter caption"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e)
                          autoResize(e.target as HTMLTextAreaElement)
                        }}
                        onBlur={field.onBlur}
                        ref={(element) => {
                          field.ref(element)
                          autoResize(element as HTMLTextAreaElement)
                        }}
                      />
                    )}
                  />
                </div> */}

                <div>
                  <LabelWithToolTip
                    htmlFor="model_url"
                    label="Platform"
                    content="Enter the full URL of the website where you did this."
                  />
                  <Controller
                    name="model_url"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="model_url"
                        placeholder="Enter the full URL of the website"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div>
                  <LabelWithToolTip
                    htmlFor="chat_link"
                    label="Public Chat Link"
                    content="Enter public chat link of this promptory"
                  />
                  <Controller
                    name="chat_link"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="chat_link"
                        placeholder="Enter public chat link"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div>
                  <LabelWithToolTip
                    htmlFor="tags"
                    label="Tags"
                    content="Enter tags separated by space (e.g., tag1 tag2 tag3)"
                  />
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
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex w-full gap-2">
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {operationType === "POST"
                ? isSubmitting
                  ? "Submitting..."
                  : "Submit"
                : isSubmitting
                  ? "Updating..."
                  : "Update"}
            </Button>
            {/* <Button
              variant="secondary"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button> */}
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
        priority={true}
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

export function LabelWithToolTip({
  htmlFor,
  label,
  content,
}: {
  htmlFor: string
  label: string
  content: string
}) {
  return (
    <Label htmlFor={htmlFor} className="mb-1 flex items-end">
      <span>{label}</span>
      <ToolTipComponent content={content}>
        <Info className="ml-2 size-3 text-muted-foreground" />
      </ToolTipComponent>
    </Label>
  )
}
