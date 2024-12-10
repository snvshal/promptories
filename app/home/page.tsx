import { getFollowingPosts } from "@/actions/getFeedPosts"
import { HomePageComponent } from "@/components/home"
import { TPost } from "@/types/schema.type"
import { getCookie } from "@/utils/cookies"
import { getPosts } from "@/utils/get-posts"
import { ps } from "@/utils/ps"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Promptories! Explore, save, and share AI prompts. Discover a growing library of prompts and their responses across platforms to enhance your prompting skills.",
}
export default async function HomePage() {
  const feedType = getCookie("feed_type") || "for-you"
  const posts =
    feedType === "following" ? await getFollowingPosts() : await getPosts()

  return <HomePageComponent posts={ps(posts as TPost[])} />
}
