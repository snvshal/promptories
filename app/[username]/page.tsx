import UserProfileComponent, { UserNotFound } from "@/components/profile/user"
import { TPost, TUser } from "@/types/schema.type"
import {
  getBookmarkedPosts,
  getLikedPosts,
  getPostsByUsername,
} from "@/utils/get-posts"

import { getUserByUsername } from "@/utils/get-user"
import { ps } from "@/utils/ps"
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: { username: string }
}): Promise<Metadata> {
  const username = params.username
  const userProfile = await getUserByUsername(username)

  return {
    title: `${userProfile?.name} (@${username})`,
    description:
      userProfile?.bio || `View the profile of @${username} on Promptories.`,
    openGraph: {
      title: `${userProfile?.name} (@${username})`,
      description: `Explore the profile of @${username} on Promptories. Find their posts, AI prompts, and interactions.`,
      url: `${process.env.METADATA_BASE_URL}/${username}`,
      siteName: "Promptories",
      images: [
        {
          url: userProfile?.avatar || "/user-fallback-image.webp",
          width: 800,
          height: 800,
          alt: `Profile image of @${username}`,
        },
      ],
      type: "profile",
    },
    twitter: {
      title: `${userProfile?.name} (@${username})`,
      description: `Discover @${username}'s posts, prompts, and AI learnings on Promptories.`,
      images: [
        {
          url: userProfile?.avatar || "/user-fallback-image.webp",
          width: 800,
          height: 800,
          alt: `Twitter profile image of @${username}`,
        },
      ],
      card: "summary_large_image",
    },
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const { username } = params

  const profileUser = await getUserByUsername(username)

  if (!profileUser) return <UserNotFound />

  const posts = await getPostsByUsername(username)
  const likedPosts = await getLikedPosts(profileUser as TUser)
  const bookmarkedPosts = await getBookmarkedPosts(profileUser as TUser)

  return (
    <UserProfileComponent
      profileUser={ps(profileUser as TUser)}
      posts={ps(posts as TPost[])}
      likedPosts={ps(likedPosts as TPost[])}
      bookmarkedPosts={ps(bookmarkedPosts as TPost[])}
    />
  )
}
