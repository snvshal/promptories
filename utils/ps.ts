import { TPost, TReplies, TUser } from "@/types/schema.type"
import { Types } from "mongoose"

export const ps = (obj: object) => JSON.parse(JSON.stringify(obj))
export const st = (t: Types.ObjectId[]) => t?.map((i) => i.toString())

export const pu = (post: TPost | TReplies) => post.user as TUser

export const il = (hasLiked: boolean) => (hasLiked ? "#b91c1c" : "none")
export const ib = (isSaved: boolean) => (isSaved ? "#3b82f6" : "none")

export const cl = (...paths: string[]) => "/" + paths.join("/")
export const postPathname = (post: TPost, ...et: string[]) =>
  cl(pu(post).username, "promptories", String(post._id), ...et)

export const objId = (id: string | undefined | unknown) =>
  new Types.ObjectId(id as string)

export const handlePostShare = async (post: TPost) => {
  const postUrl = postPathname(post)

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
