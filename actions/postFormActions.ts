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
      caption: data.caption,
      model_url: data.model_url,
      chat_link: data.chat_link,
      prompt: data.prompt,
      response: data.response,
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

    await Post.findByIdAndUpdate(
      postId,
      {
        caption: data.caption,
        model_url: data.model_url,
        chat_link: data.chat_link,
        prompt: data.prompt,
        response: data.response,
        promptory_type: data.promptory_type,
        tags: await parseTags(data.tags as string),
      },
      { new: true, useFindAndModify: false },
    );
  } catch (error) {
    console.error("Error saving post:", error);
  }
}

export const parseTags = async (tags: string): Promise<string[]> => {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length);
};
