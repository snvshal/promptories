import SearchComponent from "@/components/search"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search through a vast library of AI prompts on Promptories. Find, explore, and save the best prompts shared by the community.",
  openGraph: {
    title: "Search AI Prompts — Promptories",
    description:
      "Explore and find the most effective AI prompts shared by users on Promptories.",
    url: `${process.env.METADATA_BASE_URL}/search`,
    siteName: "Promptories",
    type: "website",
  },
  twitter: {
    title: "Search AI Prompts — Promptories",
    description:
      "Find the best AI prompts and enhance your prompting skills with Promptories.",
    card: "summary_large_image",
  },
}

export default async function SearchPage() {
  return <SearchComponent />
}
