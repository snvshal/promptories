"use client"

import { addFollower } from "@/actions/addFollower"
import { muteUser, blockUser } from "@/actions/userModeration"
import { createContext, useContext, useState } from "react"

export type ContextUser = {
  readonly id: string
  username: string
  name: string
  readonly email: string
  bio?: string
  avatar?: string
  external_link?: string
  posts: string[]
  likes: string[]
  saved: string[]
  blocked: string[]
  muted: string[]
  followers: string[]
  following: string[]
}

type UserContextType = {
  user: ContextUser | null
  setUser: React.Dispatch<React.SetStateAction<ContextUser | null>>
  setUserFollowing: (
    userId: string,
  ) => Promise<{ success: boolean; status: "Follow" | "Following" }>
  setUserMuted: (
    userId: string,
  ) => Promise<{ success: boolean; status: "Muted" | "Unmuted" }>
  setUserBlocked: (
    userId: string,
  ) => Promise<{ success: boolean; status: "Blocked" | "Unblocked" }>
  isUserMuted: (userId: string) => boolean
  isUserBlocked: (userId: string) => boolean
  isUserFollowed: (userId: string) => boolean
  isAuthorized: (email: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: ContextUser | null
}) {
  const [user, setUser] = useState<ContextUser | null>(initialUser)

  const setUserFollowing = async (
    userId: string,
  ): Promise<{ success: boolean; status: "Follow" | "Following" }> => {
    try {
      const { success, status } = await addFollower(userId)
      if (success && status) {
        setUser((prev) => {
          if (!prev) return null

          return {
            ...prev,
            following:
              status === "Following"
                ? [...prev.following, userId]
                : prev.following.filter((id) => id !== userId),
          }
        })
        return { success: true, status }
      }
      return { success: false, status: "Follow" }
    } catch (error) {
      console.error("Error updating follower state:", error)
      return { success: false, status: "Follow" }
    }
  }

  const setUserMuted = async (
    userId: string,
  ): Promise<{ success: boolean; status: "Muted" | "Unmuted" }> => {
    try {
      const { success, status } = await muteUser(userId)
      if (success && status) {
        setUser((prev) => {
          if (!prev) return null

          const newState = {
            ...prev,
            muted:
              status === "Muted"
                ? [...prev.muted, userId]
                : prev.muted.filter((id) => id !== userId),
          }

          // If muting, also remove from following
          if (status === "Muted") {
            newState.following = prev.following.filter((id) => id !== userId)
          }

          return newState
        })
        return { success: true, status }
      }
      return { success: false, status: "Unmuted" }
    } catch (error) {
      console.error("Error muting user:", error)
      return { success: false, status: "Unmuted" }
    }
  }

  const setUserBlocked = async (
    userId: string,
  ): Promise<{ success: boolean; status: "Blocked" | "Unblocked" }> => {
    try {
      const { success, status } = await blockUser(userId)
      if (success && status) {
        setUser((prev) => {
          if (!prev) return null

          return {
            ...prev,
            blocked:
              status === "Blocked"
                ? [...prev.blocked, userId]
                : prev.blocked.filter((id) => id !== userId),
            // When blocking, also add to muted and remove from following
            muted:
              status === "Blocked"
                ? prev.muted.includes(userId)
                  ? prev.muted
                  : [...prev.muted, userId]
                : prev.muted.filter((id) => id !== userId),
            following: prev.following.filter((id) => id !== userId),
          }
        })

        return { success: true, status }
      }
      return { success: false, status: "Unblocked" }
    } catch (error) {
      console.error("Error blocking user:", error)
      return { success: false, status: "Unblocked" }
    }
  }

  // Helper functions to check user status
  const isAuthorized = (email: string): boolean => {
    return user?.email === email
  }

  const isUserMuted = (userId: string): boolean => {
    return user?.muted.includes(userId) ?? false
  }

  const isUserBlocked = (userId: string): boolean => {
    return user?.blocked.includes(userId) ?? false
  }

  const isUserFollowed = (userId: string): boolean => {
    return user?.following.includes(userId) ?? false
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setUserFollowing,
        setUserMuted,
        setUserBlocked,
        isUserMuted,
        isUserBlocked,
        isUserFollowed,
        isAuthorized,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used inside UserProvider")
  return ctx
}

// Optional: Enhanced hook with additional utilities
// export function useUserModerationActions() {
//   const { user, setUserMuted, setUserBlocked, isUserMuted, isUserBlocked } =
//     useUser()

//   const toggleMute = async (userId: string) => {
//     const currentlyMuted = isUserMuted(userId)
//     const success = await setUserMuted(userId)
//     return { success, newStatus: success ? !currentlyMuted : currentlyMuted }
//   }

//   const toggleBlock = async (userId: string) => {
//     const currentlyBlocked = isUserBlocked(userId)
//     const success = await setUserBlocked(userId)
//     return {
//       success,
//       newStatus: success ? !currentlyBlocked : currentlyBlocked,
//     }
//   }

//   return {
//     user,
//     toggleMute,
//     toggleBlock,
//     isUserMuted,
//     isUserBlocked,
//   }
// }
