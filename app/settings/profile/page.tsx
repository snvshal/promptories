import ProfileSettings from "@/components/settings/profile"
import { TUser } from "@/types/schema.type"
import { currentUser } from "@/utils/get-user"
import { ps } from "@/utils/ps"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit Profile",
  description:
    "Update your profile information, bio, and social links on Promptories.",
  openGraph: {
    title: "Edit Profile — Promptories",
    description:
      "Customize your profile information and let others know more about you.",
    url: `${process.env.METADATA_BASE_URL}/settings/profile`,
    siteName: "Promptories",
    type: "website",
  },
  twitter: {
    title: "Edit Profile — Promptories",
    description: "Update your bio and social links on Promptories.",
    card: "summary",
  },
}

export default async function ProfileSettingsPage() {
  const user = await currentUser()
  return <ProfileSettings user={ps(user as TUser)} />
}
