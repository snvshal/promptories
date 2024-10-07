"use server";

import { connectToDatabase } from "@/utils/db";
import { Post } from "@/models/post.model"; // Mongoose model
import { ps } from "@/utils/ps";
import { User } from "@/models/user.model";

export async function searchPosts(query: string) {
  try {
    await connectToDatabase();

    let searchQuery = {};

    const regex = { $regex: query.slice(2).trim(), $options: "i" };
    const pft = (prefix: string) =>
      query.toLocaleLowerCase().startsWith(prefix + ":");

    // Check the prefix of the query
    if (pft("t")) {
      searchQuery = { tags: { $elemMatch: regex } };
    } else if (pft("c")) {
      searchQuery = { caption: regex };
    } else if (pft("p")) {
      searchQuery = { prompt: regex };
    } else if (pft("r")) {
      searchQuery = { response: regex };
    } else {
      // Default search across all fields
      searchQuery = {
        $or: [
          { caption: { $regex: query, $options: "i" } },
          { prompt: { $regex: query, $options: "i" } },
          { response: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
        ],
      };
    }

    const searchUserQuery = {
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    };

    const posts = await Post.find(searchQuery).populate("user");
    const users = await User.find(searchUserQuery);

    return ps({ posts, users });
  } catch (error) {
    console.error(error);
  }
}
