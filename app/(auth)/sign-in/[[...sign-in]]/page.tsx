import { Metadata } from "next"
import SignInComponent from "./_sign-in"

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Promptories account to explore, create, and save AI prompts.",
  openGraph: {
    title: "Sign In — Promptories",
    description:
      "Access your Promptories account to discover and manage your AI prompts.",
    url: `${process.env.METADATA_BASE_URL}/sign-in`,
    siteName: "Promptories",
    type: "website",
  },
  twitter: {
    title: "Sign In — Promptories",
    description:
      "Join the Promptories community and access your AI prompt library.",
    card: "summary",
  },
}

export default async function SignInPage() {
  return <SignInComponent />
}
