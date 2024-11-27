import CTA from "@/components/landing-page/cta"
import Features from "@/components/landing-page/features"
import Footer from "@/components/landing-page/footer"
import Header from "@/components/landing-page/header"
import Hero from "@/components/landing-page/hero"
import HowItWorks from "@/components/landing-page/howitworks"
import Showcase from "@/components/landing-page/showcase"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default:
      "Promptories — Your Ultimate Prompt Library for AI Learning and Discovery",
    template: "%s — Promptories",
  },
  description:
    "Explore, save, and share effective AI prompts with Promptories. Discover a growing library of prompts and their responses across platforms to enhance your prompting skills and learn from others.",
  keywords: [
    "AI prompts",
    "prompt engineering",
    "prompt library",
    "prompt sharing",
    "AI learning",
    "prompt examples",
    "Next.js",
    "Tailwind CSS",
    "shadcn-ui",
    "social features",
    "Vercel",
    "AI discovery",
    "effective prompting",
  ],
  metadataBase: new URL(process.env.METADATA_BASE_URL as string),
  openGraph: {
    title: "Promptories — A Prompt Library for AI Enthusiasts",
    description:
      "Save, discover, and share powerful AI prompts and responses. Learn how to prompt smarter with Promptories.",
    url: new URL(process.env.METADATA_BASE_URL as string),
    siteName: "Promptories",
    images: [
      {
        url: "/promptories.png",
        width: 1600,
        height: 900,
        alt: "Promptories OpenGraph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    title: "Promptories — Master the Art of AI Prompting",
    description:
      "Unlock the full potential of AI with curated prompts and responses. Discover, learn, and share your best prompts.",
    images: [
      {
        url: "/promptories.png",
        width: 1600,
        height: 900,
        alt: "Promptories Twitter Image",
      },
    ],
    card: "summary_large_image",
  },
}

export default async function LandingPage() {
  const session = await getServerSession()
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <Header />
        <main>
          <Hero />
          <Features />
          <Showcase />
          <HowItWorks />
          <CTA />
        </main>
        <Footer />
      </div>
    )
  } else {
    return redirect("/home")
  }
}
