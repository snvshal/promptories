import AppearanceSettings from "@/components/settings/appearance"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Appearance Settings",
  description:
    "Customize the look and feel of your Promptories experience. Choose themes and appearance preferences.",
  openGraph: {
    title: "Appearance Settings — Promptories",
    description:
      "Personalize your appearance settings on Promptories with themes and customization options.",
    url: `${process.env.METADATA_BASE_URL}/settings/appearance`,
    siteName: "Promptories",
    type: "website",
  },
  twitter: {
    title: "Appearance Settings — Promptories",
    description: "Adjust the look and feel of your Promptories interface.",
    card: "summary",
  },
}

export default function AppearanceSettingsPage() {
  return <AppearanceSettings />
}
