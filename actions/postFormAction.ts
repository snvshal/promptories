"use server";

import { connectToDatabase } from "@/utils/db";
import { Post } from "@/models/post.model";
import { currentUser } from "@/utils/get-user";

export type FPost = {
  caption: string;
  model_url: string;
  prompt: string;
  response: string;
  promptory_type: string;
  tags?: string | undefined;
};

export async function savePostForm(data: FPost) {
  try {
    await connectToDatabase();
    const user = await currentUser();

    await Post.create({
      user: user,
      promptory_id: Date.now(),
      caption: data.caption,
      model_url: data.model_url,
      prompt: data.prompt,
      response: data.response,
      promptory_type: data.promptory_type,
      tags: await parseTags(data.tags as string),
    });
  } catch (error) {
    console.error("Error saving post:", error);
    throw new Error("Failed to save post.");
  }
}

export const parseTags = async (tags: string): Promise<string[]> => {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length);
};
