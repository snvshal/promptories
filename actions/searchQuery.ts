"use server";

import { connectToDatabase } from "@/utils/db";
import { Post } from "@/models/post.model"; // Mongoose model
import { ps } from "@/utils/ps";
import { User } from "@/models/user.model";

export async function searchPosts(query: string) {
  try {
    await connectToDatabase();

    const searchQuery = await filterSearchQuery(query);
    const searchUsersQuery = await defaultSearch(query, "users");

    const posts = await Post.find(searchQuery).populate("user");
    const users = await User.find(searchUsersQuery);

    return ps({ posts, users });
  } catch (error) {
    console.error(error);
  }
}

export async function filterSearchQuery(query: string) {
  const trimmedQuery = query.trim();

  // Ensure the query is long enough to check for prefix and colon
  if (trimmedQuery.length < 3 || trimmedQuery.charAt(1) !== ":") {
    return defaultSearch(trimmedQuery, "posts");
  }

  const regex = { $regex: trimmedQuery.slice(2).trim(), $options: "i" };
  const prefix = trimmedQuery.charAt(0).toLowerCase(); // First character as prefix

  // Define a mapping for prefixes
  const prefixMap: Record<string, object> = {
    t: { tags: { $elemMatch: regex } },
    c: { caption: regex },
    p: { prompt: regex },
    r: { response: regex },
  };

  // Return the corresponding search query or default search if prefix is invalid
  return prefixMap[prefix] || defaultSearch(trimmedQuery, "posts");
}

// Default search across all fields
export async function defaultSearch(query: string, qt: "posts" | "users") {
  const regex = { $regex: query.trim(), $options: "i" };

  if (qt === "users") {
    return {
      $or: [{ username: regex }, { name: regex }],
    };
  } else {
    return {
      $or: [
        { caption: regex },
        { prompt: regex },
        { response: regex },
        { tags: { $elemMatch: regex } },
      ],
    };
  }
}
