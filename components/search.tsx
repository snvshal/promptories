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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ArrowLeft,
  Search as SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { Header } from "./post";
import { searchPosts } from "@/actions/searchQuery";

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [emptyQueryError, setEmptyQueryError] = useState("");
  //   const [activeTab, setActiveTab] = useState("posts");

  // Mock search results
  const posts = [
    {
      id: 1,
      title: "Creative Writing Prompt for GPT-4",
      prompt:
        "Write a short story about a world where people communicate only through music.",
      tags: ["CreativeWriting", "AI", "MusicWorld", "GPT4"],
      likes: 34,
      comments: 12,
      saves: 8,
      user: {
        name: "Alice Johnson",
        username: "@alicewrites",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      postedAt: "2023-06-15T14:30:00Z",
    },
    {
      id: 2,
      title: "Data Analysis Prompt for GPT-4",
      prompt:
        "Analyze the correlation between coffee consumption and productivity in a hypothetical dataset.",
      tags: ["DataAnalysis", "AI", "Productivity", "Coffee", "GPT4"],
      likes: 28,
      comments: 15,
      saves: 10,
      user: {
        name: "Bob Smith",
        username: "@datasmith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      postedAt: "2023-06-14T09:45:00Z",
    },
  ];

  const users = [
    {
      id: 1,
      name: "Alice Johnson",
      username: "@alicewrites",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "AI enthusiast | Creative writer | Coffee lover",
      followers: 1234,
      posts: 89,
    },
    {
      id: 2,
      name: "Bob Smith",
      username: "@datasmith",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Data scientist | AI researcher | Tea aficionado",
      followers: 987,
      posts: 56,
    },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery) {
      setEmptyQueryError("Query cannot be empty");
      return;
    }
    const result = await searchPosts(searchQuery);
    console.log(result);
    console.log("Searching for:", searchQuery);
    // Here you would typically fetch search results based on the query
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="main-content">
        <Card className="mid-width-post-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Search Prompto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex space-x-2">
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
              {posts.map((post) => (
                <Card key={post.id} className="mid-width-post-card">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={post.user.avatar}
                          alt={post.user.name}
                        />
                        <AvatarFallback>
                          {post.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{post.user.name}</p>
                        <p className="text-sm text-gray-500">
                          {post.user.username}
                        </p>
                      </div>
                      {/* <p className="ml-auto text-sm text-gray-500">
                        {new Date(post.postedAt).toLocaleString()}
                      </p> */}
                    </div>
                    <CardTitle className="mt-4 text-xl font-semibold">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-background">{post.prompt}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
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
          </TabsContent>
          <TabsContent value="users">
            <div className="mt-6 space-y-6">
              {users.map((user) => (
                <Card key={user.id} className="mid-width-post-card">
                  <CardContent className="flex items-center space-x-4 py-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.username}</p>
                      <p className="mt-1 text-sm text-gray-700">{user.bio}</p>
                      <div className="mt-2 flex space-x-4">
                        <p className="text-sm text-gray-500">
                          {user.followers} followers
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.posts} posts
                        </p>
                      </div>
                    </div>
                    <Button>Follow</Button>
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
