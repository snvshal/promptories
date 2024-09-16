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
    Menu,
    X,
    PlusCircle,
    User,
} from "lucide-react";
import { posts } from "@/lib/seed";
import { SidebarComponent, ToggleSidebar } from "./sidebar";

export function HomePageComponent() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="h-dvh flex">
            {/* Sidebar for larger screens */}
            <SidebarComponent />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                <ToggleSidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Search prompts..."
                                    className="pl-8 w-full"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div> */}
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <div key={post.id} className="w-full">
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                            <div className="flex items-center space-x-4">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={post.user.avatar}
                                                        alt={post.user.name}
                                                    />
                                                    <AvatarFallback>
                                                        {post.user.name.charAt(
                                                            0
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex items-center justify-center gap-2">
                                                    <p className="font-semibold">
                                                        {post.user.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {post.user.username}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground sm:ml-auto">
                                                {/* {new Date( */}
                                                {post.postedAt}
                                                {/* ).toString()} */}
                                            </p>
                                        </div>
                                        {/* <CardTitle className="text-xl font-semibold mt-4">
                                            {post.title}
                                        </CardTitle> */}
                                    </div>
                                    <div>
                                        <div className="space-y-4">
                                            <div className="mt-4">
                                                <p className="text-primary">
                                                    {post.explanation}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {post.tags.map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                        >
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 rounded-lg border p-4">
                                                <div>
                                                    <h3 className="font-semibold mb-2 text-muted-foreground ">
                                                        Prompt:
                                                    </h3>
                                                    <p className="text-primary">
                                                        {post.prompt}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-2 text-muted-foreground ">
                                                        Response:
                                                    </h3>
                                                    <ScrollArea className="h-60 rounded-lg border p-4">
                                                        <p className="text-primary whitespace-pre-wrap">
                                                            {post.response}
                                                        </p>
                                                    </ScrollArea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
