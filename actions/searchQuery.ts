"use server";

import { connectToDatabase } from "@/utils/db";
import { Post } from "@/models/post.model";
import { ps } from "@/utils/ps";
import { User } from "@/models/user.model";

export async function searchPosts(query: string, category: string) {
  try {
    await connectToDatabase();

    const searchQuery = await filterSearchQuery(query, category);
    const searchUsersQuery = await userSearchQuery(query, category);

    const posts = await Post.find(searchQuery).populate("user");
    const users = await User.find(searchUsersQuery);

    return ps({ posts, users });
  } catch (error) {
    console.error(error);
  }
}

export async function filterSearchQuery(query: string, category: string) {
  const regex = { $regex: query, $options: "i" };

  const categoryMap: Record<string, object> = {
    tags: { tags: { $elemMatch: regex } },
    caption: { caption: regex },
    prompt: { prompt: regex },
    response: { response: regex },
  };

  return categoryMap[category] || defaultSearch(query);
}

// Default search across all fields
export async function defaultSearch(query: string) {
  const regex = { $regex: query, $options: "i" };

  return {
    $or: [
      { caption: regex },
      { prompt: regex },
      { response: regex },
      { tags: { $elemMatch: regex } },
    ],
  };
}

export async function userSearchQuery(query: string, category: string) {
  const regex = { $regex: query.trim(), $options: "i" };

  if (category === "username") {
    return { username: regex };
  } else {
    return {
      $or: [{ username: regex }, { name: regex }],
    };
  }
}
