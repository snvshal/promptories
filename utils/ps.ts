import { pu } from "@/components/home";
import { TPost } from "@/types/schema.type";
import { Types } from "mongoose";

export const ps = (obj: object) => JSON.parse(JSON.stringify(obj));

export const objId = (id: string | undefined) =>
  new Types.ObjectId(id as string);

export const handlePostShare = async (post: TPost) => {
  const postUrl = `${process.env.METADATA_BASE_URL}/${pu(post).username}/promptories/${post._id?.toString() as string}`; // Replace with dynamic post URL

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check out this post!",
        url: postUrl,
      });
    } catch (error) {
      console.error("Error sharing", error);
    }
  } else {
    // Fallback for copying the link
    navigator.clipboard.writeText(postUrl);
    alert("Link copied to clipboard");
  }
};

export const st = (t: Types.ObjectId[]) =>
  t?.map((i) => i.toString() as string);

export const updatePostValues = (post: TPost) => {
  return {
    caption: post.caption,
    model_url: post.model_url,
    chat_link: post.chat_link,
    prompt: post.prompt,
    response: post.response,
    promptory_type: post.promptory_type,
    tags: post.tags.join(),
  };
};

// export const dataKey = (post: TPost) => {
//   // const timestamp = new Date(post.createdAt?.toString() as string).getTime();
//   // const randomKey = Math.floor(Math.random() * 10e10).toString(36);
//   const usernameCode = pu(post)
//     .username.split("")
//     .map((char) => char.charCodeAt(0).toString(36)) // Convert each char code to base-36
//     .join(""); // Join the base-36 values into a single string
//   const postId = post._id
//     ?.toString()
//     .split("")
//     .map((char) => char.charCodeAt(0).toString(36)) // Convert each char code to base-36
//     .join("");

//   return `${usernameCode}-${postId}`;
// };
