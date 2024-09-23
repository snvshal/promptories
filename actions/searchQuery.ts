"use server";

import { connectToDatabase } from "@/utils/db";
import { Post } from "@/models/post.model"; // Mongoose model
import { ps } from "@/utils/ps";

export async function searchPosts(input: string) {
  try {
    await connectToDatabase();

    let searchQuery = {};

    // Check the prefix of the input
    if (input.startsWith("#")) {
      searchQuery = { tags: { $regex: input.slice(1), $options: "i" } };
    } else if (input.startsWith("c:")) {
      searchQuery = { caption: { $regex: input.slice(2), $options: "i" } };
    } else if (input.startsWith("p:")) {
      searchQuery = { prompt: { $regex: input.slice(2), $options: "i" } };
    } else if (input.startsWith("r:")) {
      searchQuery = { response: { $regex: input.slice(2), $options: "i" } };
    } else {
      // Default search across all fields
      searchQuery = {
        $or: [
          { caption: { $regex: input, $options: "i" } },
          { prompt: { $regex: input, $options: "i" } },
          { response: { $regex: input, $options: "i" } },
          { tags: { $regex: input, $options: "i" } },
        ],
      };
    }

    const results = await Post.find(searchQuery);

    return ps(results);
  } catch (error) {
    console.error(error);
  }
}
