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
  Send,
} from "lucide-react";
import { ModeToggle } from "./ui/theme-provider";
import Link from "next/link";
import { TPost, TReplies, TUser } from "@/types/schema.type";
import { TimeAgo } from "./time-ago";
import {
  handleLikePost,
  handleBookmarkPost,
} from "@/actions/handlePostActions";
import { Types } from "mongoose";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PostOptions } from "./post";
import { Textarea } from "./ui/textarea";
import { addReplyToPost } from "@/actions/addReplyToPost";

export const pu = (post: TPost | TReplies) => post.user as TUser;

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
            <Link href={"/compose/promptory"} prefetch={false}>
              <Pen size={15} />
            </Link>
            <Link href={`/${user?.username}`} prefetch={false}>
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <PostsComponent user={user} posts={posts} />
      </main>
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
  const router = useRouter();

  if (!posts.length) {
    return (
      <div className="flex-center w-full p-4">
        <p>No posts here.</p>
      </div>
    );
  }

  const postClick = (post: TPost) =>
    router.push(`/${pu(post).username}/promptories/${post.promptory_id}`);
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card
          key={post._id?.toString()}
          className="bordery-y-0 w-full cursor-pointer"
        >
          <CardHeader className="pb-0">
            <div className="flex-between">
              <div className="flex-start space-x-4">
                <Link
                  href={`/${pu(post).username}`}
                  className="flex-start space-x-4"
                  prefetch={false}
                >
                  <Avatar>
                    <AvatarImage src={pu(post).avatar} alt={pu(post).name} />
                    <AvatarFallback>{pu(post).name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-start gap-1">
                    <p className="font-semibold">{pu(post).name}</p>
                    <p className="text-muted-foreground">
                      &#64;{pu(post).username}
                    </p>
                  </div>
                </Link>
                <p className="text-sm text-muted-foreground">
                  &#8226; <TimeAgo timestamp={post.createdAt as Date} />
                </p>
              </div>
              <PostOptions user={user} post={post} />
            </div>
          </CardHeader>
          <CardContent
            role="button"
            onClick={() => postClick(post)}
            className="border-0 pl-20"
          >
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
          <CardFooter className="flex justify-between pl-20">
            <div className="flex space-x-4">
              {/* Like Button */}
              <LikeButton
                postId={post._id as string}
                initialLikes={post.likes.length}
                userId={user._id as string}
                hasLikedInitial={post.likes.includes(
                  user._id as Types.ObjectId,
                )}
              />
              {/* <Button variant="ghost" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                {post.replies.length}
              </Button> */}
              <PostReplyDialog post={post} />
              {/* Bookmark Button */}
              <BookmarkButton
                postId={post._id as string}
                initialBookmarks={post.bookmarks.length}
                userId={user._id as string}
                hasBookmarkedInitial={post.bookmarks.includes(
                  user._id as Types.ObjectId,
                )}
              />
            </div>
            <Button variant="ghost" size="sm" aria-label="Share Post">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export type LikeButtonProps = {
  postId: string;
  initialLikes: number;
  userId: string;
  hasLikedInitial: boolean;
};

export const il = (hasLiked: boolean) => (hasLiked ? "#b91c1c" : "none");

export const LikeButton = ({
  postId,
  initialLikes,
  userId,
  hasLikedInitial,
}: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(hasLikedInitial);

  const handleLikeClick = async (e: React.FormEvent) => {
    e.preventDefault();

    // Optimistically update state
    setHasLiked(!hasLiked);
    setLikes(hasLiked ? likes - 1 : likes + 1);

    // Server action to handle like/unlike
    await handleLikePost(postId, userId);
  };

  return (
    <form onSubmit={handleLikeClick}>
      <Button variant="ghost" size="sm" aria-label="Like Post">
        <Heart
          style={{ color: il(hasLiked) }}
          fill={il(hasLiked)}
          className={`mr-2 h-4 w-4`}
        />
        {likes}
      </Button>
    </form>
  );
};

// export default LikeButton;

export type BookmarkButtonProps = {
  postId: string;
  initialBookmarks: number;
  userId: string;
  hasBookmarkedInitial: boolean;
};

export const ib = (isSaved: boolean) => (isSaved ? "#3b82f6" : "none");

export const BookmarkButton = ({
  postId,
  initialBookmarks,
  userId,
  hasBookmarkedInitial,
}: BookmarkButtonProps) => {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [hasBookmarked, setHasBookmarked] = useState(hasBookmarkedInitial);

  const handleBookmarkClick = async (e: React.FormEvent) => {
    e.preventDefault();

    // Optimistically update state
    setHasBookmarked(!hasBookmarked);
    setBookmarks(hasBookmarked ? bookmarks - 1 : bookmarks + 1);

    // Server action to handle bookmark/unbookmark
    await handleBookmarkPost(postId, userId);
  };

  return (
    <form onSubmit={handleBookmarkClick}>
      <Button variant="ghost" size="sm" aria-label="Bookmark Post ">
        <Bookmark
          style={{ color: ib(hasBookmarked) }}
          className={`mr-2 h-4 w-4`}
          fill={ib(hasBookmarked)}
        />
        {bookmarks}
      </Button>
    </form>
  );
};

export function PostReplyDialog({ post }: { post: TPost }) {
  const [dialogState, setDialogState] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [emptyReplyError, setEmptyReplyError] = useState("");
  const [repliesCount, setRepliesCount] = useState(post.replies.length);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent) {
      setEmptyReplyError("Reply is required!");
      return;
    }
    try {
      await addReplyToPost(post._id as string, replyContent);
      setRepliesCount((prev) => prev + 1);
      console.log("Reply submitted:", replyContent);
      setReplyContent("");
      setDialogState(false);
      // Here you would typically send the reply to your backend
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Reply to Post">
          <MessageCircle className="mr-2 h-4 w-4" />
          {repliesCount}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reply to Post</DialogTitle>
          <DialogDescription>
            Type your reply to this post. Click submit when you&#39;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReplySubmit} className="w-full">
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => {
                setReplyContent(e.target.value);
                setEmptyReplyError("");
              }}
              className="col-span-3"
            />
            {emptyReplyError && (
              <p className="mt-1 text-sm text-red-500">{emptyReplyError}</p>
            )}
          </div>
          <Button className="w-full" aria-label="Submit Reply">
            <Send className="mr-2 h-4 w-4" />
            Submit Reply
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
