"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon } from "lucide-react";
import { NavigateBackHeader } from "./post";
import { searchPosts } from "@/actions/searchQuery";
import { TPost, TUser } from "@/types/schema.type";
import { PostsComponent } from "./home";
import { addFollower } from "@/actions/addFollower";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SearchComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [searchQuery, setSearchQuery] = useState(query ?? "");
  const [emptyQueryError, setEmptyQueryError] = useState("");
  const [matchedPosts, setMatchedPosts] = useState<TPost[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<TUser[]>([]);

  const queryTab = searchParams.get("tab");
  const router = useRouter();
  console.log(query);

  // router.push(`?tab=posts`);
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery?.trim()) {
      setSearchQuery("");
      setEmptyQueryError("Search query cannot be empty");
      return;
    }
    router.push(`?q=${searchQuery}&tab=posts`);
  };

  const handleTabChange = (value: string) =>
    router.push(`?q=${query}&tab=${value}`);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const { posts, users } = await searchPosts(query as string);
        setMatchedPosts(posts);
        setMatchedUsers(users);
        // setTab(queryTab as "posts" | "users");
        console.log("Searching for:", query);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query?.trim()) {
      fetchSearchResults();
    }
  }, [query, queryTab]);

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
            <form onSubmit={handleSearchSubmit} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search for posts, users, or tags..."
                value={searchQuery as string}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
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
  const { data: session, update } = useSession();
  const currentUser = session?.user;

  const router = useRouter();

  // Follow state for each user stored in an object (ID as key, follow status as value)
  const [followStates, setFollowStates] = useState<
    Record<string, "Follow" | "Following">
  >({});

  const [followers, setFollowers] = useState<Record<string, number>>({});

  // Function to initialize follow state for all matched users
  useEffect(() => {
    if (currentUser && matchedUsers?.length) {
      const initialStates: Record<string, "Follow" | "Following"> = {};
      matchedUsers.forEach((profileUser: TUser) => {
        initialStates[profileUser._id?.toString() as string] =
          currentUser.following?.includes(profileUser._id?.toString() as string)
            ? "Following"
            : "Follow";
      });
      setFollowStates(initialStates); // Set initial follow states
    }
  }, [matchedUsers, currentUser]);

  // Function to initialize follow state for all matched users
  useEffect(() => {
    if (currentUser && matchedUsers?.length) {
      const initialStates: Record<string, number> = {};
      matchedUsers.forEach((profileUser: TUser) => {
        initialStates[profileUser._id?.toString() as string] =
          profileUser.followers.length;
      });
      setFollowers(initialStates); // Set initial follow states
    }
  }, [matchedUsers, currentUser]);

  // Handle follow/unfollow logic for a specific user
  const handleFollowToggle = async (profileUser: TUser) => {
    try {
      const { updatedState, following } = await addFollower(
        profileUser._id?.toString() as string,
      );

      // Update follow state for the specific profile user
      setFollowStates((prevStates) => ({
        ...prevStates,
        [profileUser._id?.toString() as string]: updatedState as
          | "Follow"
          | "Following",
      }));

      await update({
        ...session,
        user: {
          ...session?.user,
          following: [...following],
        },
      });

      setFollowers((prevFollowers) => {
        const userId = profileUser._id?.toString() as string;
        const currentFollowerCount = prevFollowers[userId] ?? 0; // Default to 0 if undefined

        const isUnfollowing = updatedState === "Follow";
        const newFollowerCount = isUnfollowing
          ? Math.max(currentFollowerCount - 1, 0) // Avoid negative follower count
          : currentFollowerCount + 1;

        return {
          ...prevFollowers,
          [userId]: newFollowerCount,
        };
      });
    } catch (error) {
      console.error("Error updating follower state:", error);
    }
  };

  if (!matchedUsers.length) {
    return (
      <div className="flex-center w-full p-4 max-md:pt-10">
        <p>No users matched</p>
      </div>
    );
  }

  return (
    <>
      {matchedUsers?.map((user) => (
        <Card key={user._id?.toString()} className="mid-width-card-content">
          <CardContent className="flex items-center space-x-4 py-4">
            <Avatar
              role="button"
              className="h-16 w-16"
              onClick={() => router.push(`/${user.username}`)}
            >
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <Link href={`/${user.username}`} className="flex-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                &#64;{user.username}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>
              <div className="mt-2 flex space-x-4">
                <p className="text-sm text-muted-foreground">
                  {followers[user._id?.toString() as string]} followers
                </p>
                <p className="text-sm text-muted-foreground">
                  {/* {user.posts.length} posts */}
                </p>
              </div>
            </Link>
            {!(user._id?.toString() === currentUser?.id) && (
              <Button
                variant={
                  followStates[user._id?.toString() as string] === "Follow"
                    ? "default"
                    : "secondary"
                }
                onClick={() => handleFollowToggle(user)}
              >
                {followStates[user._id?.toString() as string]}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
