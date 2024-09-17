"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  MessageSquare,
  Search,
  Home,
  BookOpen,
  Compass,
  Users,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
} from "lucide-react";
import { posts } from "@/lib/seed";
import { ModeToggle } from "./ui/theme-provider";
import Link from "next/link";

export function HomePageComponent() {
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
            <Link href={"/username"}>
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

      <PostsComponent />
    </div>
  );
}

export function PostsComponent() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-12 lg:px-16">
      <div className="space-y-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="bordery-y-0 w-full rounded-none border-0 border-b"
          >
            <CardHeader className="p-2">
              <div className="flex-start space-x-4">
                <Link
                  href={`${post.user.username}`}
                  className="flex-start space-x-4"
                >
                  <Avatar>
                    <AvatarImage src={post.user.avatar} alt={post.user.name} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-start gap-1">
                    <p className="font-semibold">{post.user.name}</p>
                    <p className="text-muted-foreground">
                      {post.user.username}
                    </p>
                  </div>
                </Link>
                <p className="text-sm text-muted-foreground">{post.postedAt}</p>
              </div>
              {/* <CardTitle className="text-xl font-semibold">
                {post.title}
              </CardTitle> */}
            </CardHeader>
            <CardContent className="ml-10 border-0">
              <div className="mb-4">
                <div className="relative overflow-hidden">
                  {/* <h3 className="mb-2 font-semibold">Prompt:</h3> */}
                  <p className="whitespace-pre-wrap">
                    {post.explanation.split(" ").slice(0, 24).join(" ")}
                    {post.explanation.split(" ").length > 24 && (
                      <span> ...</span>
                    )}
                  </p>
                  {post.explanation.split(" ").length > 24 && (
                    <button className="mb-2 text-blue-500 hover:underline">
                      Show more
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* <ScrollArea className="h-60 rounded-md border p-4"> */}
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
                    <button
                      // onClick={() => setShowFullResponse(!showFullResponse)}
                      className="mt-2 text-blue-500 hover:underline"
                    >
                      Show more
                    </button>
                  )}
                </div>
              </div>
              {/* </ScrollArea> */}
            </CardContent>
            <CardFooter className="ml-10 flex justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <Heart className="mr-2 h-4 w-4" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" />
                  {post.saves}
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
