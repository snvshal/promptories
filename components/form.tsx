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
})

export type FormValues = z.infer<typeof formSchema>

export default function PostForm({
  defaultValues,
  operationType,
  post,
}: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const router = useRouter()

  const postRoute = (post: TPost) =>
    router.push(`/${pu(post).username}/promptories/${post._id as string}`)

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      if (operationType === "POST") {
        const post: TPost = await savePostForm(data) // Call the server action

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
        await updatePostForm(data, post._id as string) // Call the server action

        postRoute(post)
        toast({
          description: "Your post has been updated.",
        })
      }

      // Simulate API call
      console.log("Form saved:", data)
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
                <Input id="model_url" placeholder="Enter model" {...field} />
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
                  placeholder="Enter tags (comma-separated)"
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </main>
    </div>
  )
}
