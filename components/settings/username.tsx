"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { isUsernameUnique, updateUsername } from "@/actions/profileActions"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { ContextUser, useUser } from "@/hooks/use-user"

const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .superRefine(async (username, ctx) => {
      const result = await isUsernameUnique(username)
      if (!result.status) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.message,
        })
      }
    }),
})

export type UsernameFormValues = z.infer<typeof usernameSchema>

export default function UsernameSettings() {
  const { user, setUser } = useUser()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)

  const usernameForm = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: user?.username,
    },
  })

  const onUsernameSubmit = async (data: UsernameFormValues) => {
    try {
      setLoading(true)
      const { success } = await updateUsername(data.username)
      if (success) {
        setUser((prev) => ({ ...prev, username: data.username }) as ContextUser)
        await update({
          ...session,
          user: {
            ...session?.user,
            username: data.username,
          },
        })

        toast({
          title: "Username updated",
          description: "Your username has been successfully updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your username.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Username</CardTitle>
        <CardDescription>Update your unique username</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...usernameForm}>
          <form
            onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}
            className="space-y-4"
          >
            <FormField
              control={usernameForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new username" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a unique username. It must be 3-20 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                user?.username === usernameForm.getValues("username") ||
                usernameForm.watch("username") === "" ||
                loading
              }
            >
              {loading ? "Changing..." : "Change Username"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
