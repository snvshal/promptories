import UsernameSettings from "@/components/settings/username"
import { TUser } from "@/types/schema.type"
import { currentUser } from "@/utils/get-user"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Change Username",
  description:
    "Easily update your username on Promptories. Make your profile unique and easily identifiable.",
  openGraph: {
    title: "Change Username — Promptories",
    description: "Update your username for a unique identity on Promptories.",
    url: `${process.env.METADATA_BASE_URL}/settings/username`,
    siteName: "Promptories",
    type: "website",
  },
  twitter: {
    title: "Change Username — Promptories",
    description: "Set a new username for your Promptories profile.",
    card: "summary",
  },
}

export default async function UsernameSettingsPage() {
  const user = await currentUser()
  return <UsernameSettings user={user as TUser} />
}
