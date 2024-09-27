"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon } from "lucide-react";
import { Header } from "./post";
import { searchPosts } from "@/actions/searchQuery";
import { TPost, TUser } from "@/types/schema.type";
import { PostsComponent } from "./home";
import { useSession } from "next-auth/react";
import { addFollower } from "@/actions/addFollower";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { st } from "@/utils/ps";

export default function SearchComponent({
  user: currentUser,
}: {
  user: TUser;
}) {
  // const { data: session } = useSession();
  // const currentUser = session?.user;
  // console.log(currentUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [emptyQueryError, setEmptyQueryError] = useState("");
  const [matchedPosts, setMatchedPosts] = useState<TPost[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<TUser[]>([]);

  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const router = useRouter();

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchQuery("");
      setEmptyQueryError("Search query cannot be empty");
      return;
    }
    router.push(`/search?q=${searchQuery}`);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const { posts, users } = await searchPosts(query as string);
        setMatchedPosts(posts);
        setMatchedUsers(users);
        console.log("Searching for:", query);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query?.trim()) {
      fetchSearchResults();
    }
  }, [query]);

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
        initialStates[profileUser._id?.toString() as string] = st(
          currentUser.following,
        ).includes(profileUser._id?.toString() as string)
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
      const updatedState = await addFollower(
        profileUser._id?.toString() as string,
      );

      // console.log(updatedState);

      // Update follow state for the specific profile user
      setFollowStates((prevStates) => ({
        ...prevStates,
        [profileUser._id?.toString() as string]: updatedState as
          | "Follow"
          | "Following",
      }));

      setFollowers((prevStates) => {
        // Retrieve the current follower count from the previous state
        const currentFollowerCount =
          prevStates[profileUser._id?.toString() as string];

        // Determine if we are following or unfollowing
        const isUnfollowing = updatedState === "Follow"; // 'Follow' means the user is currently unfollowing

        // Calculate the new follower count
        const newFollowerCount = isUnfollowing
          ? Math.max(currentFollowerCount - 1, 0) // Decrement if unfollowing, ensuring it doesn't go below zero
          : currentFollowerCount + 1; // Increment if following

        return {
          ...prevStates,
          [profileUser._id?.toString() as string]: newFollowerCount,
        };
      });
    } catch (error) {
      console.error("Error updating follower state:", error);
    }
  };

  // console.log(followStates);

  return (
    <div className="min-h-screen">
      <div className="max-md:hidden">
        <Header />
      </div>

      <main className="main-content">
        <Card className="mid-width-post-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Search Prompto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearchSubmit} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search for posts, users, or tags..."
                value={searchQuery}
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

        <Tabs
          defaultValue="posts"
          className="w-full"
          //   onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="mt-6 space-y-6">
              <PostsComponent posts={matchedPosts as TPost[]} />
            </div>
          </TabsContent>
          <TabsContent value="users">
            <div className="mt-6 space-y-6">
              {matchedUsers?.map((user) => (
                <Card
                  key={user._id?.toString()}
                  className="mid-width-post-card"
                >
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
                      <p className="mt-1 text-sm text-muted-foreground">
                        {user.bio}
                      </p>
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
                          followStates[user._id?.toString() as string] ===
                          "Follow"
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
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
