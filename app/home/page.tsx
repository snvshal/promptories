import { Metadata } from "next"
import { HomePageComponent } from "@/components/home"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Promptories! Explore, save, and share AI prompts. Discover a growing library of prompts and their responses across platforms to enhance your prompting skills.",
}
export default async function HomePage() {
  return <HomePageComponent />
}
