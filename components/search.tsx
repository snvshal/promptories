"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { CheckCircle, Filter, Loader2, SearchIcon } from "lucide-react"
import { NavigateBackHeader } from "./home"
import { search } from "@/actions/searchQuery"
import { TPost, TUser } from "@/types/schema.type"
import { PostsComponent } from "./home"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "./ui/label"
import { FollowButton, TabsTriggerButton } from "./profile/user"
import { AvatarComponent } from "./post/content"
import { cl } from "@/utils/ps"

export default function SearchComponent() {
  const router = useRouter()

  const [searchState, setSearchState] = useState(useValidatedSearchParams())

  const [searchQuery, setSearchQuery] = useState(searchState.q)
  const [results, setResults] = useState<{ posts: TPost[]; users: TUser[] }>({
    posts: [],
    users: [],
  })
  const [emptyQueryError, setEmptyQueryError] = useState("")
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  const updateSearchParams = (newParams: Partial<typeof searchState>) => {
    const updatedParams = { ...searchState, ...newParams }
    setSearchState(updatedParams)
    const searchUrl = new URLSearchParams(updatedParams).toString()
    router.push(`/search?${searchUrl}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setEmptyQueryError("Search query cannot be empty")
      return
    }
    updateSearchParams({ q: searchQuery })
  }

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchState.q.trim()) {
        try {
          setSearchLoading(true)

          const results = await search(
            searchState.q.trim(),
            searchState.category as SearchCategories,
            searchState.dateRange as SearchDateRange,
          )

          setResults(results)
          setSearchLoading(false)
        } catch (error) {
          console.error("Error fetching search results:", error)
        }
      }
    }
    fetchSearchResults()
  }, [searchState.q, searchState.category, searchState.dateRange])

  return (
    <div className="w-full">
      <NavigateBackHeader page="Search" />
      <main className="main-content">
        <Card className="mb-0 w-full rounded-none border-0 shadow-none">
          <CardContent className="p-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex gap-2">
                <Input
                  type="text"
                  name="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setEmptyQueryError("")
                  }}
                  className="flex-1"
                />
                <Button type="submit">
                  <SearchIcon className="h-4 w-4" />
                  <span className="ml-2 max-sm:hidden">Search</span>
                </Button>
                <SearchFilterDialog
                  open={isFilterDialogOpen}
                  setOpen={setIsFilterDialogOpen}
                  searchState={searchState}
                  updateSearchParams={updateSearchParams}
                />
              </div>
            </form>
            {emptyQueryError && (
              <p className="mt-1 text-sm text-red-500">{emptyQueryError}</p>
            )}
          </CardContent>
        </Card>

        {searchState.q ? (
          <Tabs
            value={searchState.tab}
            onValueChange={(value) =>
              updateSearchParams({ tab: value as "posts" | "users" })
            }
            className="w-full"
          >
            <div className="border-b">
              <TabsList className="mt-4 grid h-12 w-full grid-cols-2 rounded-none border-b bg-background p-0">
                <TabsTriggerButton tabValue="posts" tab={searchState.tab}>
                  Posts
                </TabsTriggerButton>
                <TabsTriggerButton tabValue="users" tab={searchState.tab}>
                  Users
                </TabsTriggerButton>
              </TabsList>
            </div>
            <TabsContent value="posts" className="m-0">
              {searchLoading ? (
                <div className="flex-center mt-20 size-full">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <PostsComponent posts={results.posts} />
              )}
            </TabsContent>
            <TabsContent value="users" className="m-0">
              {searchLoading ? (
                <div className="flex-center mt-20 size-full">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <MatchedUsers matchedUsers={results.users} />
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-center w-full border-t p-4 max-md:pt-10">
            <p>Searched results will appear here</p>
          </div>
        )}
      </main>
    </div>
  )
}

function MatchedUsers({ matchedUsers }: { matchedUsers: TUser[] }) {
  if (!matchedUsers?.length) {
    return (
      <div className="flex-center w-full p-4 max-md:pt-10">
        <p>No users matched</p>
      </div>
    )
  }

  return (
    <>
      {matchedUsers.map((matchedUser) => (
        <UserProfileCard
          key={matchedUser._id?.toString()}
          profileUser={matchedUser}
        />
      ))}
    </>
  )
}

function UserProfileCard({ profileUser }: { profileUser: TUser }) {
  const [followers, setFollowers] = useState(profileUser.followers.length)

  return (
    <Card className="mid-width-card-content shadow-none">
      <CardContent className="flex items-center space-x-4 p-4">
        <AvatarComponent
          user={profileUser}
          size="size-8 "
          classname="size-16 self-start"
        />
        <Link href={cl(profileUser.username)} className="flex-1">
          <h3 className="text-lg font-semibold hover:underline">
            {profileUser.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            &#64;{profileUser.username}
          </p>
          <p className="mt-1 text-sm">{profileUser.bio}</p>
          <div className="mt-2 flex space-x-4">
            <p className="text-sm">
              {followers}{" "}
              <span className="text-muted-foreground">Followers</span>
            </p>
            <p className="text-sm">
              {profileUser.posts.length}{" "}
              <span className="text-muted-foreground">Posts</span>
            </p>
          </div>
        </Link>
        <FollowButton profileUser={profileUser} setFollowers={setFollowers} />
      </CardContent>
    </Card>
  )
}

function SearchFilterDialog({
  open,
  setOpen,
  searchState,
  updateSearchParams,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  searchState: {
    category: string
    dateRange: string
  }
  updateSearchParams: (params: Partial<typeof searchState>) => void
}) {
  const [localCategory, setLocalCategory] = useState(searchState.category)
  const [localDateRange, setLocalDateRange] = useState(searchState.dateRange)

  useEffect(() => {
    setLocalCategory(searchState.category)
    setLocalDateRange(searchState.dateRange)
  }, [searchState, open])

  const handleDone = () => {
    updateSearchParams({ category: localCategory, dateRange: localDateRange })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Filter className="h-4 w-4" />
          <span className="ml-2 max-sm:hidden">Filters</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Filters</DialogTitle>
          <DialogDescription>
            Refine your search results using the filters below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label className="text-sm font-medium">Category</Label>
            <Select value={localCategory} onValueChange={setLocalCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="caption">Caption</SelectItem>
                <SelectItem value="prompt">Prompt</SelectItem>
                <SelectItem value="response">Response</SelectItem>
                <SelectItem value="tags">Tags</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Date Range</Label>
            <Select value={localDateRange} onValueChange={setLocalDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="button" onClick={handleDone}>
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>Done</span>
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export type SearchCategories =
  | "default"
  | "response"
  | "prompt"
  | "caption"
  | "user"
  | "tags"

export type SearchDateRange =
  | "default"
  | "today"
  | "thisWeek"
  | "thisMonth"
  | "thisYear"

export function useValidatedSearchParams() {
  const searchParams = useSearchParams()

  const validTabs: ("posts" | "users")[] = ["posts", "users"]
  const validCategories: SearchCategories[] = [
    "default",
    "response",
    "prompt",
    "caption",
    "user",
    "tags",
  ]
  const validDateRanges: SearchDateRange[] = [
    "default",
    "today",
    "thisWeek",
    "thisMonth",
    "thisYear",
  ]

  const q = searchParams.get("q") ?? ""

  const tab = validTabs.includes(searchParams.get("tab") as "posts" | "users")
    ? (searchParams.get("tab") as "posts" | "users")
    : "posts"

  const category = validCategories.includes(
    searchParams.get("category") as SearchCategories,
  )
    ? (searchParams.get("category") as string)
    : "default"

  const dateRange = validDateRanges.includes(
    searchParams.get("dateRange") as SearchDateRange,
  )
    ? (searchParams.get("dateRange") as string)
    : "default"

  return { q, tab, category, dateRange }
}
