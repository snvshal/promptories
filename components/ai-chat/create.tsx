"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ScrollArea } from "../ui/scroll-area"
import { saveAIChat } from "@/actions/aiChatActions"

const aiChatFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50, {
      message: "Title must not exceed 40 characters.",
    }),
  description: z
    .string()
    .min(25, {
      message: "Description must be at least 25 characters.",
    })
    .max(240, {
      message: "Description must not exceed 240 characters.",
    }),
  model: z
    .string()
    .min(2, {
      message: "Model must be at least 2 characters.",
    })
    .max(25, {
      message: "Model must not exceed 20 characters.",
    }),
  chat_link: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .min(4, {
      message: "Chat link must be at least 4 characters.",
    })
    .max(200, {
      message: "Chat link must not exceed 200 characters.",
    }),
})

export type AIChatFormValue = z.infer<typeof aiChatFormSchema>

export default function AIChatDialogForm() {
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const form = useForm<AIChatFormValue>({
    resolver: zodResolver(aiChatFormSchema),
    defaultValues: {
      title: "",
      description: "",
      model: "",
      chat_link: "",
    },
  })

  const onSubmit = async (values: AIChatFormValue) => {
    await saveAIChat(values)

    toast({
      description: "Your AI chat has been sent.",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className="p-2">
        <ScrollArea className="rounded-md p-2 pr-4 sm:h-[calc(100vh-5rem)]">
          <DialogHeader className="px-2">
            <DialogTitle>Create AI Chat Entry</DialogTitle>
            <DialogDescription>
              Enter the details for your AI chat. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 px-2"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter chat title" {...field} />
                    </FormControl>
                    <FormDescription>
                      The title of your AI chat (2-40 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter chat description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of the chat (25-240 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Model</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., ChatGPT, Claude, Gemini"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The AI model used for this chat (2-20 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chat_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/chat"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The URL of the chat (4-200 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
