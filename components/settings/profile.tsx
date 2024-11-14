"use client"

import { z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateUserData } from "@/actions/profileActions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const profileSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(160).optional(),
  twitter: z
    .string()
    .url("Invalid URL")
    .max(40)
    .regex(
      /^https:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+$/,
      "Invalid Twitter/X URL",
    )
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("Invalid URL")
    .max(40)
    .regex(
      /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+$/,
      "Invalid GitHub URL",
    )
    .optional()
    .or(z.literal("")),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfileSettings() {
  const { data: session, update } = useSession()
  const user = session?.user

  const [avatar, setAvatar] = useState<string | null>(user?.image as string)

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
      twitter: user?.social_links?.twitter as string,
      github: user?.social_links?.github as string,
    },
  })

  const router = useRouter()

  const onSubmit = async (data: ProfileFormValues) => {
    try {
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
            social_links: {
              twitter: data.twitter,
              github: data.github,
            },
          },
        })

        router.push(`/${user?.username}`)

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
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatar as string} alt="User avatar" />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>

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
                      variant="secondary"
                      onClick={() => open()}
                      type="button"
                    >
                      Upload Profile Picture
                    </Button>
                  )}
                </CldUploadWidget>
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
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your twitter account link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Github account link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
