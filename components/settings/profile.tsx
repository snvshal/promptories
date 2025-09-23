"use client"

import { z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateUserData } from "@/actions/profileActions"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { ACCEPTED_IMAGE_TYPES } from "../form"
import { AvatarComponent } from "../post/content"
import { TUser } from "@/types/schema.type"

const profileSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(160).optional(),
  external_link: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfileSettings({ user }: { user: TUser }) {
  const { data: session, update } = useSession()

  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null)

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    const info = result?.info as {
      secure_url: string
      resource_type: string
      format: string
      bytes: number
    }
    setAvatar(info.secure_url)
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name as string,
      bio: user?.bio as string,
      external_link: user?.external_link as string,
    },
  })

  const router = useRouter()

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setLoading(true)
      const dataWithAvatar = { ...data, avatar }
      const { success } = await updateUserData(dataWithAvatar)

      if (success) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name: data.name,
            bio: data.bio,
            image: avatar,
            external_link: data.external_link,
          },
        })

        router.back()

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar</Label>
              <div className="flex items-center space-x-4">
                <AvatarComponent
                  user={{ avatar: avatar as string }}
                  size="size-10"
                  classname="size-20 cursor-auto"
                />
                <CldUploadWidget
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                  }
                  options={{
                    cropping: true,
                    croppingAspectRatio: 1, // 1:1 aspect ratio
                    folder: "profile_pics", // Optional: specify folder in Cloudinary
                    maxFileSize: 1_000_000, // Limit to 1MB, if needed
                    resourceType: "image",
                    clientAllowedFormats: ACCEPTED_IMAGE_TYPES,
                  }}
                  onSuccess={handleUpload}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => open()}
                    >
                      Upload
                    </Button>
                  )}
                </CldUploadWidget>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setAvatar("")}
                  disabled={!avatar}
                >
                  Remove
                </Button>
              </div>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="external_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading || !form.formState.isDirty}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
