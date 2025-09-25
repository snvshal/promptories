"use server"

import { FeedPostsType } from "@/hooks/use-posts"
import { Post } from "@/models/post.model"
import { TPost } from "@/types/schema.type"
import { connectToDatabase } from "@/utils/db"
// import { getPosts } from "@/utils/get-posts"
import { currentUser } from "@/utils/get-user"
import { ps } from "@/utils/ps"
import { cookies } from "next/headers"

import { Types } from "mongoose"

// Enhanced personalized feed algorithm
export const getPosts = async (
  limit: number = 10,
  offset: number = 0,
): Promise<TPost[]> => {
  try {
    await connectToDatabase()
    const user = await currentUser()

    if (!user) {
      // Fallback to time-based for non-authenticated users
      const posts: TPost[] = await Post.find({})
        .populate("user")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
      return posts
    }

    // Get user's blocked and muted user IDs
    const blockedUserIds =
      user.blocked?.map((id) => (id instanceof Types.ObjectId ? id : id._id)) ||
      []
    const mutedUserIds =
      user.muted?.map((id) => (id instanceof Types.ObjectId ? id : id._id)) ||
      []
    const excludedUserIds = [...blockedUserIds, ...mutedUserIds]

    // Get user's interaction data
    const userLikes =
      user.likes?.map((id) => (id instanceof Types.ObjectId ? id : id._id)) ||
      []
    const userSaved =
      user.saved?.map((id) => (id instanceof Types.ObjectId ? id : id._id)) ||
      []
    const userFollowing =
      user.following?.map((id) =>
        id instanceof Types.ObjectId ? id : id._id,
      ) || []

    // Fetch posts with enhanced data for scoring
    const posts = await Post.aggregate([
      // Exclude blocked and muted users
      {
        $match: {
          user: { $nin: excludedUserIds },
        },
      },
      // Join with user data
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      // Get interaction counts
      {
        $lookup: {
          from: "posts",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ["$$postId", "$likes"] }],
                },
              },
            },
            { $count: "likeCount" },
          ],
          as: "likeData",
        },
      },
      // Add computed fields for scoring
      {
        $addFields: {
          likeCount: {
            $ifNull: [{ $arrayElemAt: ["$likeData.likeCount", 0] }, 0],
          },
          // Time decay factor (newer posts get higher scores)
          hoursSincePosted: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60, // Convert to hours
            ],
          },
          // User relationship score
          isFollowing: {
            $cond: [{ $in: ["$user._id", userFollowing] }, 1, 0],
          },
          isOwnPost: {
            $cond: [{ $eq: ["$user._id", user._id] }, 1, 0],
          },
          // User has previously interacted with this author
          hasInteractedWithAuthor: {
            $cond: [
              {
                $or: [
                  { $in: ["$user._id", userLikes] },
                  { $in: ["$user._id", userSaved] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
      // Calculate personalization score
      {
        $addFields: {
          personalizedScore: {
            $add: [
              // Base engagement score (likes)
              { $multiply: ["$likeCount", 2] },

              // Relationship bonuses
              { $multiply: ["$isFollowing", 10] }, // Following gets high priority
              { $multiply: ["$isOwnPost", 5] }, // Own posts get medium priority
              { $multiply: ["$hasInteractedWithAuthor", 3] }, // Previous interactions

              // Time decay (fresher content gets bonus)
              {
                $cond: [
                  { $lt: ["$hoursSincePosted", 24] }, // Last 24 hours
                  { $subtract: [24, "$hoursSincePosted"] },
                  {
                    $cond: [
                      { $lt: ["$hoursSincePosted", 168] }, // Last week
                      {
                        $divide: [
                          { $subtract: [168, "$hoursSincePosted"] },
                          10,
                        ],
                      },
                      0, // Older than a week gets no time bonus
                    ],
                  },
                ],
              },

              // Content quality indicators
              {
                $cond: [
                  { $gt: [{ $strLenCP: { $ifNull: ["$content", ""] } }, 100] }, // Longer posts
                  2,
                  0,
                ],
              },

              // Diversity bonus (prevent echo chambers)
              {
                $cond: [
                  { $eq: ["$isFollowing", 0] }, // Non-following users get small boost for diversity
                  1,
                  0,
                ],
              },
            ],
          },
        },
      },
      // Sort by personalized score, then by recency
      {
        $sort: {
          personalizedScore: -1,
          createdAt: -1,
        },
      },
      // Apply pagination
      { $skip: offset },
      { $limit: limit },
      // Clean up the output
      {
        $project: {
          likeData: 0,
          hoursSincePosted: 0,
          personalizedScore: 0,
          isFollowing: 0,
          isOwnPost: 0,
          hasInteractedWithAuthor: 0,
          likeCount: 0,
        },
      },
    ])

    return posts
  } catch (error) {
    console.error("Error fetching personalized posts:", error)

    // Fallback to simple time-based query if algorithm fails
    const fallbackPosts: TPost[] = await Post.find({})
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
    return fallbackPosts
  }
}

// Enhanced following posts with similar personalization
export async function getFollowingPosts(
  limit: number = 10,
  offset: number = 0,
) {
  try {
    await connectToDatabase()
    const user = await currentUser()
    if (!user) {
      console.error("No current user found.")
      return [] as TPost[]
    }

    // Get blocked and muted users
    const blockedUserIds =
      user.blocked?.map((id) => (id instanceof Types.ObjectId ? id : id._id)) ||
      []
    const mutedUserIds =
      user.muted?.map((id) => (id instanceof Types.ObjectId ? id : id._id)) ||
      []
    const excludedUserIds = [...blockedUserIds, ...mutedUserIds]

    if (!user.following || user.following.length === 0) {
      // Show only user's own posts if not following anyone
      const userPosts = await Post.find({
        $and: [{ user: user._id }, { user: { $nin: excludedUserIds } }],
      })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("user")
      return userPosts as TPost[]
    }

    // Filter following list to exclude blocked/muted users
    const cleanFollowing = user.following.filter((followingId) => {
      const id =
        followingId instanceof Types.ObjectId ? followingId : followingId._id
      return !excludedUserIds.some((excludedId) =>
        (excludedId as Types.ObjectId).equals(id as Types.ObjectId),
      )
    })

    const posts = await Post.aggregate([
      {
        $match: {
          user: { $in: [...cleanFollowing, user._id] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      // Simple scoring for following feed (mainly chronological with engagement boost)
      {
        $addFields: {
          hoursSincePosted: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60,
            ],
          },
        },
      },
      {
        $sort: {
          // Prioritize recent posts with slight engagement consideration
          createdAt: -1,
        },
      },
      { $skip: offset },
      { $limit: limit },
      {
        $project: {
          hoursSincePosted: 0,
        },
      },
    ])

    return posts as TPost[]
  } catch (error) {
    console.error("Error fetching posts from following:", error)
    return [] as TPost[]
  }
}

export async function fetchFeedPosts(
  limit: number = 10,
): Promise<FeedPostsType> {
  const cookieStore = await cookies()
  const feedType = cookieStore.get("feed_type")
  const forYou = await getPosts(limit)
  const following = await getFollowingPosts(limit)

  return ps({
    feedType: (feedType?.value as "for_you" | "following") || "for_you",
    forYou: forYou || [],
    following: following || [],
  })
}
