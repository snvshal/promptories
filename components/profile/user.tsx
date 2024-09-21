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
import { ArrowLeft, User2 } from "lucide-react";
import Link from "next/link";

export default function UserProfileComponent({
  user,
  profileUser,
  posts,
  likedPosts,
  bookmarkedPosts,
}: {
  user: TUser;
  profileUser: TUser;
  posts: TPost[];
  likedPosts: TPost[];
  bookmarkedPosts: TPost[];
}) {
  if (!profileUser) return <UserNotFound />;

  console.log();

  const isAdmin = user._id?.toString() === profileUser._id?.toString();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">Prompto</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <ProfileUserContent
            profileUser={profileUser}
            postCount={posts.length}
            isAdmin={isAdmin}
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
            <TabsContent value="posts">
              <PostsComponent user={user} posts={posts} />
            </TabsContent>
            {isAdmin && (
              <>
                <TabsContent value="likes">
                  <PostsComponent user={user} posts={likedPosts} />
                </TabsContent>
                <TabsContent value="saved">
                  <PostsComponent user={user} posts={bookmarkedPosts} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export function ProfileUserContent({
  profileUser,
  postCount,
  isAdmin,
}: {
  profileUser: TUser;
  postCount: number;
  isAdmin: boolean;
}) {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="mb-4 h-24 w-24">
            <AvatarImage src={profileUser?.avatar} alt={profileUser?.name} />
            <AvatarFallback>{profileUser?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{profileUser?.name}</h2>
          <p className="text-muted-foreground">{profileUser?.username}</p>
          <p className="mt-2 text-gray-700">{profileUser?.bio}</p>
          <div className="mt-4 flex justify-center space-x-4">
            <div>
              <p className="font-semibold">{profileUser?.followers.length}</p>
              <p className="text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="font-semibold">{profileUser?.following.length}</p>
              <p className="text-muted-foreground">Following</p>
            </div>
            <div>
              <p className="font-semibold">{postCount}</p>
              <p className="text-muted-foreground">Posts</p>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            {isAdmin ? (
              <Button onClick={() => signOut()} variant="outline">
                Sign Out
              </Button>
            ) : (
              <Button>Follow</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
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
