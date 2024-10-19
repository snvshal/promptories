"use server";

import { connectToDatabase } from "@/utils/db";
import { Post } from "@/models/post.model";
import { currentUser } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export type FPost = {
  caption: string;
  model_url: string;
  chat_link?: string;
  prompt: string;
  response: string;
  promptory_type: string;
  tags?: string | undefined;
};

export async function savePostForm(data: FPost) {
  try {
    await connectToDatabase();
    const user = await currentUser();

    const post = await Post.create({
      user: user,
      caption: data.caption.trim(),
      model_url: data.model_url.trim(),
      chat_link: data.chat_link?.trim(),
      prompt: data.prompt.trim(),
      response: data.response.trim(),
      promptory_type: data.promptory_type,
      tags: await parseTags(data.tags as string),
    });

    return ps(post);
  } catch (error) {
    console.error("Error saving post:", error);
  }
}

export async function updatePostForm(data: FPost, postId: string) {
  try {
    await connectToDatabase();

    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found!");

    const user = await currentUser();

    if (!post.user.equals(user?._id))
      throw new Error("Not authorized to delete this post.");

    post.caption = data.caption.trim();
    post.model_url = data.model_url.trim();
    post.chat_link = data.chat_link?.trim();
    post.prompt = data.prompt.trim();
    post.response = data.response.trim();
    post.promptory_type = data.promptory_type;
    post.tags = await parseTags(data.tags as string);

    // Save the updated post
    await post.save();
  } catch (error) {
    console.error("Error saving post:", error);
  }
}

export const parseTags = async (tags: string): Promise<string[]> => {
  return tags
    .split(" ")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length);
};
