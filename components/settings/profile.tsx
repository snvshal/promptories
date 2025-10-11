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
import { updateUserData } from "@/actions/profile"
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
import { ContextUser, useUser } from "@/hooks/use-user"
import { SettingsContentCard } from "./settings-list"

export const normalizeUrl = (url: string): string => {
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url
  }
  return url
}

export const isValidDomainOrUrl = (input: string): boolean => {
  try {
    const url = new URL(normalizeUrl(input))

    // Only allow http/https
    if (!["http:", "https:"].includes(url.protocol)) return false

    // Must have a valid hostname (e.g., ai.com)
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname)) return false

    return true
  } catch {
    return false
  }
}

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(20, "Name cannot exceed 20 characters"),
  bio: z
    .string()
    .trim()
    .max(160, "Bio cannot exceed 160 characters")
    .optional(),
  external_link: z
    .string()
    .trim()
    .max(120, "Link cannot exceed 120 characters")
    .optional()
    .refine((val) => !val || isValidDomainOrUrl(val), {
      message: "Invalid URL format",
    })
    .transform((val) => (val ? normalizeUrl(val) : val)),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfileSettings() {
  const { user, setUser } = useUser()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState<string>(
    user?.avatar ?? "/avatar-placeholder.png",
  )

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    const info = result?.info as {
      secure_url: string
      resource_type: string
      format: string
      bytes: number
      coordinates?: {
        custom?: number[][]
      }
    }

    // Check if crop coordinates exist
    const cropData = info.coordinates?.custom?.[0]

    if (cropData && cropData.length === 4) {
      const [x, y, width, height] = cropData

      // Build the cropped image URL
      const urlParts = info.secure_url.split("/upload/")
      const croppedUrl = `${urlParts[0]}/upload/c_crop,x_${Math.round(x)},y_${Math.round(y)},w_${Math.round(width)},h_${Math.round(height)}/${urlParts[1]}`

      setAvatar(croppedUrl)
    } else {
      // Fallback to original if no crop data
      setAvatar(info.secure_url)
    }
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
        setUser((prev) => ({ ...prev, ...dataWithAvatar }) as ContextUser)

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
    <SettingsContentCard
      title="Your Profile"
      description="Manage your profile information."
    >
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
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                  cropping: true,
                  croppingAspectRatio: 1,
                  croppingCoordinatesMode: "custom",
                  croppingShowDimensions: true,
                  multiple: false,
                  showSkipCropButton: false,
                  folder: "profile_pics",
                  maxFileSize: 1_000_000,
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
                onClick={() => setAvatar("/avatar-placeholder.png")}
                disabled={avatar === "/avatar-placeholder.png"}
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
                  <Textarea
                    className="min-h-[80px]"
                    placeholder="Tell us about yourself"
                    {...field}
                  />
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

          <Button
            type="submit"
            disabled={
              loading || (!form.formState.isDirty && avatar === user?.avatar)
            }
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </Form>
    </SettingsContentCard>
  )
}
