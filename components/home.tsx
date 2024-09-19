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
import { timeAgo } from "@/utils/time-ago";

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
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="@username"
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <PostsComponent posts={posts} />
    </div>
  );
}

export function PostsComponent({ posts }: { posts: TPost[] }) {
  const pu = (post: TPost) => post.user as TUser;
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-12 lg:px-16">
      <div className="space-y-6">
        {posts.map((post) => (
          <Card
            key={post._id as string}
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
                  • {timeAgo(post.createdAt as Date)}
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
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
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
                <Button variant="ghost" size="sm">
                  <Heart className="mr-2 h-4 w-4" />
                  {post.likes_count}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.replies.length}
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" />
                  {post.bookmarks.length}
                </Button>
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
