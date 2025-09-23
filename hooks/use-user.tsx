"use client"

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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used inside UserProvider")
  return ctx
}
