import { TPost, TReplies, TUser } from "@/types/schema.type"
import { Types } from "mongoose"

export const ps = (obj: object) => JSON.parse(JSON.stringify(obj))
export const st = (t: Types.ObjectId[]) => t?.map((i) => i.toString())

export const pu = (post: TPost | TReplies) => post.user as TUser
export const iv = (status: boolean) => (status ? "secondary" : "ghost")
export const fw = (status: boolean) => (status ? "font-bold" : "font-medium")
export const il = (hasLiked: boolean) => (hasLiked ? "#b91c1c" : "none")
export const ib = (isSaved: boolean) => (isSaved ? "#3b82f6" : "none")

export const objId = (id: string | undefined | unknown) =>
  new Types.ObjectId(id as string)

export const handlePostShare = async (post: TPost) => {
  const postUrl = `/${pu(post).username}/promptories/${post._id?.toString() as string}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check out this post!",
        url: postUrl,
      })
    } catch (error) {
      console.error("Error sharing", error)
    }
  } else {
    navigator.clipboard.writeText(postUrl)
    alert("Link copied to clipboard")
  }
}

export const parseTags = (tags: string): string[] => {
  return tags
    .split(" ")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length)
}
