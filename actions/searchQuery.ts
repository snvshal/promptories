"use server"

import { connectToDatabase } from "@/utils/db"
import { Post } from "@/models/post.model"
import { ps } from "@/utils/ps"
import { User } from "@/models/user.model"
import { SearchCategories } from "@/components/search"

export async function search(
  query: string,
  category: SearchCategories,
  dateRange: string,
) {
  try {
    await connectToDatabase()

    const searchQuery = await filterSearchQuery(query, category)
    const searchUsersQuery = await userSearchQuery(query, category)

    // console.log("Search Query:", JSON.stringify(searchQuery, null, 2))
    // console.log("User Search Query:", JSON.stringify(searchUsersQuery, null, 2))

    const dateRangeFilter = await filterDateRange(dateRange)

    const posts = await Post.find({
      ...searchQuery,
      ...dateRangeFilter,
    }).populate("user")

    const users = await User.find(searchUsersQuery)

    return ps({ posts, users })
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Cast Error: ${error.message}`)
    } else {
      console.error(error)
    }
  }
}

export async function filterSearchQuery(
  query: string,
  category: SearchCategories,
) {
  if (category === "default") return defaultSearch(query)

  const regex = new RegExp(query, "i")
  const categoryMap: Record<string, object> = {
    tags: { tags: { $elemMatch: { $regex: regex } } },
    caption: { caption: regex },
    prompt: { prompt: regex },
    response: { response: regex },
  }

  return categoryMap[category] || defaultSearch(query)
}

// Default search across all fields
export async function defaultSearch(query: string) {
  const regex = new RegExp(query, "i")

  return {
    $or: [
      { caption: regex },
      { prompt: regex },
      { response: regex },
      { tags: { $elemMatch: { $regex: regex } } },
    ],
  }
}

export async function userSearchQuery(
  query: string,
  category: SearchCategories,
) {
  const regex = new RegExp(query, "i")

  if (category === "user") {
    return { username: regex }
  } else {
    return {
      $or: [{ username: regex }, { name: regex }],
    }
  }
}

// Function to filter by date range
export async function filterDateRange(dateRange: string) {
  const currentDate = new Date()
  let startDate: Date | undefined

  switch (dateRange) {
    case "today":
      startDate = new Date(currentDate.setHours(0, 0, 0, 0))
      break
    case "thisWeek":
      startDate = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay()),
      )
      startDate.setHours(0, 0, 0, 0) // Set to the start of the day
      break
    case "thisMonth":
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      break
    case "thisYear":
      startDate = new Date(currentDate.getFullYear(), 0, 1)
      break
    default:
      return {}
  }

  return startDate ? { createdAt: { $gte: startDate } } : {}
}
