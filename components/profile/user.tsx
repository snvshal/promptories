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
import { signOut } from "next-auth/react";
import { TPost, TUser } from "@/types/schema.type";
import { useParams } from "next/navigation";
import { User2 } from "lucide-react";

export default function UserProfileComponent({
  user,
  profileUser,
  posts,
}: {
  user: TUser;
  profileUser: TUser;
  posts: TPost[];
}) {
  if (!profileUser) return <UserNotFound />;

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="mb-4 h-24 w-24">
                  <AvatarImage
                    src={profileUser?.avatar}
                    alt={profileUser?.name}
                  />
                  <AvatarFallback>
                    {profileUser?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{profileUser?.name}</h2>
                <p className="text-muted-foreground">{profileUser?.username}</p>
                <p className="mt-2 text-gray-700">{profileUser?.bio}</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <div>
                    <p className="font-semibold">
                      {profileUser?.followers.length}
                    </p>
                    <p className="text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {profileUser?.following.length}
                    </p>
                    <p className="text-muted-foreground">Following</p>
                  </div>
                  <div>
                    <p className="font-semibold">{posts.length}</p>
                    <p className="text-muted-foreground">Posts</p>
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button>Follow</Button>
                  <Button onClick={() => signOut()} variant="outline">
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              <PostsComponent user={user} posts={posts} />
            </TabsContent>
            <TabsContent value="likes">
              <div className="py-8 text-center">
                Liked posts will appear here.
              </div>
            </TabsContent>
            <TabsContent value="saved">
              <div className="py-8 text-center">
                Saved posts will appear here.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export function UserNotFound() {
  const { username } = useParams();
  console.log(username);
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
