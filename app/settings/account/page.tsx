import AccountSettings from "@/components/settings/account"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account Settings",
  description:
    "Manage your account settings, change your password, and configure security preferences on Promptories.",
  openGraph: {
    title: "Account Settings — Promptories",
    description:
      "Update your account details, password, and security options on Promptories.",
    url: `${process.env.METADATA_BASE_URL}/settings/account`,
    siteName: "Promptories",
    type: "website",
  },
  twitter: {
    title: "Account Settings — Promptories",
    description:
      "Configure your account preferences and update security settings.",
    card: "summary",
  },
}

export default function AccountSettingsPage() {
  return <AccountSettings />
}
