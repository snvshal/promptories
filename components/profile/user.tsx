"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PostsComponent } from "../home";
import { TPost, TUser } from "@/types/schema.type";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { User2 } from "lucide-react";
import { Header } from "../post";
import { addFollower } from "@/actions/addFollower";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { objId } from "@/utils/ps";

export default function UserProfileComponent({
  profileUser,
  posts,
  likedPosts,
  bookmarkedPosts,
}: {
  profileUser: TUser;
  posts: TPost[];
  likedPosts: TPost[];
  bookmarkedPosts: TPost[];
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const isAdmin = profileUser._id?.toString() === session?.user?.id;

  const searchParams = useSearchParams();
  const query = searchParams.get("tab");

  // Define the Tab type based on isAdmin
  type Tab = "posts" | "likes" | "saved";

  // Set initial tab based on query or default to "posts"
  const initialTab: Tab =
    isAdmin || query === "posts"
      ? "posts"
      : query === "likes" || query === "saved"
        ? query
        : "posts";

  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    if (query === "posts" || query === "likes" || query === "saved") {
      setTab(query as Tab);
    } else {
      setTab("posts"); // Default to posts if query is invalid
    }
  }, [query]); // Dependency array includes query

  const toggleTab = (tab: string) => {
    setTab(tab as Tab);
    router.push(`?tab=${tab}`);
  };
  return (
    <div className="min-h-screen">
      <Header />

      <main className="main-content">
        <ProfileUserContent
          profileUser={profileUser}
          postCount={posts.length}
        />
        <Tabs defaultValue={tab} className="w-full">
          <TabsList
            className={`grid w-full ${isAdmin ? "grid-cols-3" : "grid-cols-1"} `}
          >
            <TabsTrigger
              role="button"
              value="posts"
              onClick={() => toggleTab("posts")}
            >
              Posts
            </TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger
                  role="button"
                  value="likes"
                  onClick={() => toggleTab("likes")}
                >
                  Likes
                </TabsTrigger>
                <TabsTrigger
                  role="button"
                  value="saved"
                  onClick={() => toggleTab("saved")}
                >
                  Saved
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <div className="mt-8">
            <TabsContent value="posts">
              <PostsComponent posts={posts} />
            </TabsContent>
            {isAdmin && (
              <>
                <TabsContent value="likes">
                  <PostsComponent posts={likedPosts} />
                </TabsContent>
                <TabsContent value="saved">
                  <PostsComponent posts={bookmarkedPosts} />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}

export function ProfileUserContent({
  profileUser,
  postCount,
}: {
  profileUser: TUser;
  postCount: number;
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = profileUser._id?.toString() === user?.id;

  const initialFollowState = profileUser.followers.includes(objId(user?.id))
    ? "Following"
    : "Follow";

  const [follow, setFollow] = useState<"Follow" | "Following">(
    initialFollowState,
  );

  const handleAddFollower = async () => {
    try {
      const updatedState = await addFollower(profileUser._id as string);
      setFollow(updatedState as "Follow" | "Following");
    } catch (error) {
      console.error("Error updating follower state:", error);
    }
  };
  return (
    <Card className="mid-width-post-card mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="mb-4 h-24 w-24">
            <AvatarImage src={profileUser?.avatar} alt={profileUser?.name} />
            <AvatarFallback>{profileUser?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{profileUser?.name}</h2>
          <p className="text-muted-foreground">&#64;{profileUser?.username}</p>
          <p className="mt-2">{profileUser?.bio}</p>
          <div className="mt-4 flex justify-center space-x-4">
            <div>
              <p className="font-semibold">{postCount}</p>
              <p className="text-muted-foreground">Posts</p>
            </div>

            <div>
              <p className="font-semibold">{profileUser?.following.length}</p>
              <p className="text-muted-foreground">Following</p>
            </div>
            <div>
              <p className="font-semibold">{profileUser?.followers.length}</p>
              <p className="text-muted-foreground">Followers</p>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            {!isAdmin && (
              <Button
                variant={follow === "Follow" ? "default" : "secondary"}
                onClick={handleAddFollower}
              >
                {follow}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserNotFound() {
  const { username } = useParams();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="mb-4 h-24 w-24">
              <AvatarImage src={""} alt={"user not found!"} />
              <AvatarFallback>
                <User2 size={48} />
              </AvatarFallback>
            </Avatar>
            <CardHeader className="text-2xl font-bold">
              User Not Found!
            </CardHeader>
            <div className="pb-3">
              <p>
                We couldn&#39;t find a user with the username &#34;{username}
                &#34;.
              </p>
            </div>
            <CardFooter>
              The user may have changed their username or the account may no
              longer exist.
            </CardFooter>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
