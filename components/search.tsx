"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Filter, Search as SearchIcon } from "lucide-react";
import { NavigateBackHeader } from "./post";
import { search } from "@/actions/searchQuery";
import { TPost, TUser } from "@/types/schema.type";
import { PostsComponent } from "./home";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SetAction } from "@/types/generics.type";
import { Label } from "./ui/label";
import { FollowButton } from "./profile/user";

export type SearchCategories =
  | "default"
  | "response"
  | "prompt"
  | "caption"
  | "user"
  | "tags";

export default function SearchComponent() {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");
  const queryTab = searchParams.get("tab");
  const category = searchParams.get("category");
  const dateRange = searchParams.get("dateRange");

  const [searchQuery, setSearchQuery] = useState(query ?? "");
  const [emptyQueryError, setEmptyQueryError] = useState("");
  const [matchedPosts, setMatchedPosts] = useState<TPost[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<TUser[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    category ?? "default",
  );
  const [selectedDateRange, setSelectedDateRange] = useState(
    dateRange ?? "default",
  );
  const [open, setOpen] = useState(false); // Search Filter Dialog State

  const router = useRouter();

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery?.trim()) {
      setSearchQuery("");
      setEmptyQueryError("Search query cannot be empty");
      return;
    }
    const searchUrl = `?q=${searchQuery}&category=${selectedCategory}&tab=${queryTab ?? "posts"}&dateRange=${selectedDateRange}`;
    router.push(searchUrl);
  };

  const handleTabChange = (value: string) => {
    const changeTabUrl = `?q=${query}&category=${category}&tab=${value}&dateRange=${dateRange}`;
    router.push(changeTabUrl);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const { posts, users }: { posts: TPost[]; users: TUser[] } =
          await search(
            query?.trim() as string,
            category as string,
            dateRange as string,
          );

        setMatchedPosts(posts);
        setMatchedUsers(users);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query?.trim()) {
      fetchSearchResults();
    }
  }, [query, category, dateRange]);

  return (
    <div className="min-h-screen">
      <NavigateBackHeader />
      <main className="main-content">
        <Card className="mid-width-card-content md:mb-4">
          <CardHeader className="max-md:p-4">
            <CardTitle className="text-xl font-semibold">
              Search Promptories
            </CardTitle>
          </CardHeader>
          <CardContent className="max-md:p-4 max-md:pt-0">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search for posts, users, or tags..."
                  value={searchQuery as string}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <SearchIcon className="h-4 w-4" />
                  <span className="ml-2 max-sm:hidden">Search</span>
                </Button>
                <SearchFilterDialog
                  open={open}
                  setOpen={setOpen}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  dateRange={selectedDateRange}
                  setDateRange={setSelectedDateRange}
                />
              </div>
            </form>
            {emptyQueryError && (
              <p className="mt-1 text-sm text-red-500">{emptyQueryError}</p>
            )}
          </CardContent>
        </Card>

        {query ? (
          <Tabs
            value={(queryTab as string) || "posts"}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="max-md:border-b max-md:p-4 md:mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="posts" className="m-0">
              <PostsComponent posts={matchedPosts as TPost[]} />
            </TabsContent>
            <TabsContent value="users" className="m-0">
              <MatchedUsers matchedUsers={matchedUsers} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-center w-full p-4 max-md:pt-10">
            <p>Searched results will appear here</p>
          </div>
        )}
      </main>
    </div>
  );
}

export function MatchedUsers({ matchedUsers }: { matchedUsers: TUser[] }) {
  if (!matchedUsers.length) {
    return (
      <div className="flex-center w-full p-4 max-md:pt-10">
        <p>No users matched</p>
      </div>
    );
  }

  return (
    <>
      {matchedUsers?.map((MatchedUser) => (
        <UserProfileCard
          key={MatchedUser._id?.toString()}
          profileUser={MatchedUser}
        />
      ))}
    </>
  );
}

export function UserProfileCard({ profileUser }: { profileUser: TUser }) {
  const router = useRouter();
  const [followers, setFollowers] = useState(profileUser.followers.length ?? 0);

  return (
    <Card className="mid-width-card-content">
      <CardContent className="flex items-center space-x-4 py-4">
        <Avatar
          role="button"
          className="h-16 w-16"
          onClick={() => router.push(`/${profileUser.username}`)}
        >
          <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
          <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <Link href={`/${profileUser.username}`} className="flex-1">
          <h3 className="text-lg font-semibold">{profileUser.name}</h3>
          <p className="text-sm text-muted-foreground">
            &#64;{profileUser.username}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {profileUser.bio}
          </p>
          <div className="mt-2 flex space-x-4">
            <p className="text-sm text-muted-foreground">
              {followers} followers
            </p>
            <p className="text-sm text-muted-foreground">
              {/* {user.posts.length} posts */}
            </p>
          </div>
        </Link>
        <FollowButton profileUser={profileUser} setFollowers={setFollowers} />
      </CardContent>
    </Card>
  );
}

export function SearchFilterDialog({
  open,
  setOpen,
  selectedCategory,
  setSelectedCategory,
  dateRange,
  setDateRange,
}: {
  open: boolean;
  setOpen: SetAction<boolean>;
  selectedCategory: string;
  setSelectedCategory: SetAction<string>;
  dateRange: string;
  setDateRange: SetAction<string>;
}) {
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
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="caption">Caption</SelectItem>
                <SelectItem value="prompt">Prompt</SelectItem>
                <SelectItem value="response">Response</SelectItem>
                <SelectItem value="tags">Tags</SelectItem>
                <SelectItem value="username">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
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
        <Button type="button" onClick={() => setOpen(false)}>
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>Done</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
