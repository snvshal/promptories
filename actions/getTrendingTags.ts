"use server"

import { Post } from "@/models/post.model"
import { connectToDatabase } from "@/utils/db"

export async function getTrendingTags() {
  try {
    await connectToDatabase()

    const trendingTags = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    return trendingTags.map((tag: { _id: string; count: number }) => ({
      tag: tag._id,
      count: tag.count,
    }))
  } catch (error) {
    console.error("Error fetching trending tags:", error)
    return []
  }
}
