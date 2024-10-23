"use client"

import { useState, useEffect } from "react"
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

const formSchema = z.object({
  caption: z.string().min(1, "Caption is required"),
  model_url: z.string().url("Invalid model URL").min(10, "Model is required"),
  chat_link: z.string().url("Invalid chat URL").optional().or(z.literal("")),
  prompt: z.string().min(1, "Prompt is required"),
  response: z.string().min(1, "Response is required"),
  promptory_type: z.enum(promptory_types as [string, ...string[]], {
    required_error: "Please select a promptory type",
  }),
  tags: z.string().optional(),
  media: z.instanceof(File).optional(),
})

export type FormValues = z.infer<typeof formSchema>

export default function PostForm({
  defaultValues,
  operationType,
  post,
}: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedType, setSelectedType] = useState(
    defaultValues?.promptory_type || "",
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const router = useRouter()

  useEffect(() => {
    // Simulate loading of initial data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const postRoute = (post: TPost) =>
    router.push(`/${pu(post).username}/promptories/${post._id as string}`)

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      if (operationType === "POST") {
        const post: TPost = await savePostForm(data)
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
        await updatePostForm(data, post._id as string)
        postRoute(post)
        toast({
          description: "Your post has been updated.",
        })
      }
      console.log("Form saved:", data)
      reset()
    } catch (error) {
      setError("There was a problem sending your post.")
      toast({
        title: "Error",
        description: "There was a problem sending your post.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const showMediaInput =
    selectedType.startsWith("video-") || selectedType.startsWith("audio-")

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen w-full">
      <NavigateBackHeader
        page={operationType === "POST" ? "Create Promptory" : "Edit Promptory"}
      />
      <main className="main-content p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 max-md:p-4"
        >
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Controller
              name="caption"
              control={control}
              render={({ field }) => (
                <Textarea id="caption" placeholder="Enter caption" {...field} />
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
          </div>

          <div>
            <Label htmlFor="promptory_type">Promptory Type</Label>
            <Controller
              name="promptory_type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedType(value)
                  }}
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

          {showMediaInput && (
            <div>
              <Label htmlFor="media">Upload Media</Label>
              <Controller
                name="media"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    id="media"
                    type="file"
                    accept={
                      selectedType.startsWith("video-") ? "video/*" : "audio/*"
                    }
                    onChange={(e) => onChange(e.target.files?.[0])}
                    {...field}
                  />
                )}
              />
              {errors.media && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.media.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Controller
              name="prompt"
              control={control}
              render={({ field }) => (
                <Textarea id="prompt" placeholder="Enter prompt" {...field} />
              )}
            />
            {errors.prompt && (
              <p className="mt-1 text-sm text-red-500">
                {errors.prompt.message}
              </p>
            )}
          </div>

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
            {errors.tags && (
              <p className="mt-1 text-sm text-red-500">
                {errors.tags?.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </main>
    </div>
  )
}
