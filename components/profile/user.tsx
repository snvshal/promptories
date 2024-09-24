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
import { useParams } from "next/navigation";
import { User2 } from "lucide-react";
import { Header } from "../post";
import { addFollower } from "@/actions/addFollower";
import { useState } from "react";
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
  const { status } = useSession();
  const isAdmin = status === "authenticated";

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <ProfileUserContent
            profileUser={profileUser}
            postCount={posts.length}
          />
          <Tabs defaultValue="posts" className="w-full">
            <TabsList
              className={`grid w-full ${isAdmin ? "grid-cols-3" : "grid-cols-1"} `}
            >
              <TabsTrigger value="posts">Posts</TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger value="likes">Likes</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
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
        </div>
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
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = status === "authenticated";

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
    <Card className="mb-8">
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
