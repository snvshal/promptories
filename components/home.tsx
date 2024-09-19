"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Pen,
} from "lucide-react";
import { ModeToggle } from "./ui/theme-provider";
import Link from "next/link";
import { TPost, TUser } from "@/types/schema.type";
import { TimeAgo } from "./time-ago";
import { handleLikePost } from "@/actions/handleLikePost";
import { Types } from "mongoose";
import { handleBookmarkPost } from "@/actions/handleBookmarkPost";

export function HomePageComponent({
  user,
  posts,
}: {
  user: TUser;
  posts: TPost[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h1 className="mr-8 text-2xl font-bold text-blue-600">Prompto</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search prompts..."
                className="w-64 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ModeToggle />
            <Link href={"/compose/promptory"}>
              <Pen size={15} />
            </Link>
            <Link href={user?.username}>
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <PostsComponent user={user} posts={posts} />
    </div>
  );
}

export function PostsComponent({
  user,
  posts,
}: {
  user: TUser;
  posts: TPost[];
}) {
  const [likeStates, setLikeStates] = useState(
    posts.reduce(
      (acc, post) => {
        acc[post._id as string] = {
          likes: post.likes.length,
          hasLiked: post.likes.includes(user._id as Types.ObjectId),
          bookmarks: post.bookmarks.length,
          hasBookmarked: post.bookmarks.includes(user._id as Types.ObjectId),
        };
        return acc;
      },
      {} as Record<
        string,
        {
          likes: number;
          hasLiked: boolean;
          bookmarks: number;
          hasBookmarked: boolean;
        }
      >,
    ),
  );

  // Handle like/unlike
  const handleLikeClick = async (postId: string) => {
    setLikeStates((prevState) => {
      const hasLiked = !prevState[postId].hasLiked;
      const likes = hasLiked
        ? prevState[postId].likes + 1
        : prevState[postId].likes - 1;

      return {
        ...prevState,
        [postId]: { ...prevState[postId], likes, hasLiked },
      };
    });

    await handleLikePost(postId, user._id as string);
  };

  // Handle bookmark/unbookmark
  const handleBookmarkClick = async (postId: string) => {
    setLikeStates((prevState) => {
      const hasBookmarked = !prevState[postId].hasBookmarked;
      const bookmarks = hasBookmarked
        ? prevState[postId].bookmarks + 1
        : prevState[postId].bookmarks - 1;

      return {
        ...prevState,
        [postId]: { ...prevState[postId], bookmarks, hasBookmarked },
      };
    });

    await handleBookmarkPost(postId, user._id as string); // Call server action for bookmark/unbookmark
  };

  const ib = (postId: string) =>
    likeStates[postId].hasBookmarked ? "#3b82f6" : "none";

  const il = (postId: string) =>
    likeStates[postId].hasLiked ? "#b91c1c" : "none";

  const pu = (post: TPost) => post.user as TUser;
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-12 lg:px-16">
      <div className="space-y-6">
        {posts.map((post) => (
          <Card
            key={post._id?.toString()}
            className="bordery-y-0 w-full rounded-none border-0 border-b"
          >
            <CardHeader className="p-2">
              <div className="flex-start space-x-4">
                <Link
                  href={`/${pu(post).username}`}
                  className="flex-start space-x-4"
                >
                  <Avatar>
                    <AvatarImage src={pu(post).avatar} alt={pu(post).name} />
                    <AvatarFallback>{pu(post).name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-start gap-1">
                    <p className="font-semibold">{pu(post).name}</p>
                    <p className="text-muted-foreground">
                      @{pu(post).username}
                    </p>
                  </div>
                </Link>
                <p className="text-sm text-muted-foreground">
                  • <TimeAgo timestamp={post.createdAt as Date} />
                </p>
              </div>
            </CardHeader>
            <CardContent className="ml-10 border-0">
              <div className="mb-4">
                <div className="relative overflow-hidden">
                  <p className="whitespace-pre-wrap">
                    {post.caption.split(" ").slice(0, 24).join(" ")}
                    {post.caption.split(" ").length > 24 && <span> ...</span>}
                  </p>
                  {post.caption.split(" ").length > 24 && (
                    <button className="mb-2 text-blue-500 hover:underline">
                      Show more
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="bbn space-y-4 rounded-lg p-4">
                <div className="relative overflow-hidden">
                  <h3 className="mb-2 font-semibold">Prompt:</h3>
                  <p className="whitespace-pre-wrap">
                    {post.prompt.split(" ").slice(0, 24).join(" ")}
                    {post.prompt.split(" ").length > 24 && <span> ...</span>}
                  </p>
                  {post.prompt.split(" ").length > 24 && (
                    <button className="mt-2 text-blue-500 hover:underline">
                      Show more
                    </button>
                  )}
                </div>
                <div className="relative overflow-hidden">
                  <h3 className="mb-2 font-semibold">Response:</h3>
                  <p className="whitespace-pre-wrap">
                    {post.response.split(" ").slice(0, 24).join(" ")}
                    {post.response.split(" ").length > 24 && <span> ...</span>}
                  </p>
                  {post.response.split(" ").length > 24 && (
                    <button className="mt-2 text-blue-500 hover:underline">
                      Show more
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="ml-10 flex justify-between">
              <div className="flex space-x-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLikeClick(post._id as string);
                  }}
                >
                  <Button variant="ghost" size="sm">
                    <Heart
                      style={{ color: il(post._id as string) }}
                      fill={il(post._id as string)}
                      className={`mr-2 h-4 w-4`}
                    />
                    {likeStates[post._id as string].likes}
                  </Button>
                </form>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.replies.length}
                </Button>
                {/* Bookmark Button */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBookmarkClick(post._id as string);
                  }}
                >
                  <Button variant="ghost" size="sm">
                    <Bookmark
                      style={{ color: ib(post._id as string) }}
                      className={`mr-2 h-4 w-4`}
                      fill={ib(post._id as string)}
                    />
                    {likeStates[post._id as string].bookmarks}
                  </Button>
                </form>
              </div>
              <Button variant="ghost" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
