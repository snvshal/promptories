"use client";

import { Dispatch, SetStateAction, useState } from "react";
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
  MessageCircle,
  Share2,
  Send,
  ArrowLeft,
  Heart,
  Trash,
  Ellipsis,
  User,
  SquareArrowOutUpRight,
  Settings,
  MessageSquareShare,
} from "lucide-react";
import Link from "next/link";
import { BookmarkButton, il, LikeButton, pu } from "./home";
import { TimeAgo } from "./time-ago";
import { TPost, TReplies } from "@/types/schema.type";
import { addReplyToPost } from "@/actions/addReplyToPost";
import { Separator } from "./ui/separator";
import { deleteReply, handleLikeReply } from "@/actions/handleReplyActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { handleDeletePost } from "@/actions/handlePostActions";
import { handlePostShare, objId } from "@/utils/ps";
import { useSession } from "next-auth/react";

export default function SinglePostPage({ post }: { post: TPost }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card key={post._id?.toString()} className="bordery-y-0 mb-8 w-full">
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
              <PostOptions post={post} />
            </div>
          </CardHeader>
          <CardContent className="ml-14 border-0">
            <div className="mb-4">
              <div className="relative overflow-hidden">
                <p className="whitespace-pre-wrap">{post.caption}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
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
                <p className="whitespace-pre-wrap">{post.prompt}</p>
              </div>
              <div className="relative overflow-hidden">
                <h3 className="mb-2 font-semibold">Response:</h3>
                <ScrollArea className="h-60 rounded-md border p-4">
                  <p className="whitespace-pre-wrap">{post.response}</p>
                </ScrollArea>
                {/* <p className="whitespace-pre-wrap">{post.response}</p> */}
              </div>
            </div>
          </CardContent>
          <CardFooter className="ml-12 flex justify-between">
            <div className="flex space-x-4">
              {/* Like Button */}
              <LikeButton post={post} />
              <Button variant="ghost" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                {post.replies.length}
              </Button>
              {/* Bookmark Button */}
              <BookmarkButton post={post} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePostShare(post)}
              aria-label="Share Post"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>
        <PostReplies post={post as TPost} replies={post.replies} />
      </main>
    </div>
  );
}

export function PostReplies({
  post,
  replies,
}: {
  post: TPost;
  replies: TReplies[];
}) {
  const [replyText, setReplyText] = useState("");
  const [postReplies, setPostReplies] = useState(replies);
  const [emptyReplyError, setEmptyReplyError] = useState("");

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText) {
      setEmptyReplyError("Reply is required!");
      return;
    }

    try {
      const updatedPost = await addReplyToPost(post._id as string, replyText);
      setPostReplies(updatedPost.replies);
      console.log("Reply submitted:", replyText);
      setReplyText("");
      // Here you would typically send the reply to your backend
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Replies</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReplySubmit} className="w-full">
          <div className="flex space-x-2">
            <Input
              type="text"
              name="reply"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
                setEmptyReplyError("");
              }}
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send reply</span>
            </Button>
          </div>
        </form>
        {emptyReplyError && (
          <p className="mt-1 text-sm text-red-500">{emptyReplyError}</p>
        )}
        <Separator className="my-4" />
        <PostRepliesContent
          post={post}
          replies={postReplies}
          setPostReplies={setPostReplies}
        />
      </CardContent>
    </Card>
  );
}

export function PostRepliesContent({
  post,
  replies,
  setPostReplies,
}: {
  post: TPost;
  replies: TReplies[];
  setPostReplies: Dispatch<SetStateAction<TReplies[]>>;
}) {
  const { data: session } = useSession();
  const user = session?.user;

  if (!replies.length) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">No replies here yet!</p>
      </div>
    );
  }

  const handleLikeReplyClick = async (replyId: string) => {
    try {
      const newLikes = await handleLikeReply(post._id as string, replyId);

      setPostReplies(
        replies.map((reply) =>
          reply._id?.toString() === replyId
            ? { ...reply, likes: newLikes }
            : reply,
        ) as TReplies[],
      );
    } catch (error) {
      console.error("Error updating likes on the client:", error);
    }
  };

  return (
    <div className="space-y-4">
      {replies.map((reply, index) => (
        <div key={index} className="flex space-x-4">
          <Link href={`/${pu(reply).username}`} prefetch={false}>
            <Avatar className="mt-1 h-8 w-8">
              <AvatarImage src={pu(reply).avatar} alt={pu(reply).name} />
              <AvatarFallback>{pu(reply).name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <div className="flex-between">
              <div className="flex-start space-x-2">
                <Link
                  href={`/${pu(reply).username}`}
                  className="flex-start gap-1"
                  prefetch={false}
                >
                  <p className="font-semibold">{pu(reply).name}</p>
                  <p className="text-sm text-muted-foreground">
                    &#64;{pu(reply).username}
                  </p>
                </Link>
                <p className="space-x-4 text-sm text-muted-foreground">
                  &#8226; <TimeAgo timestamp={reply.timestamp} />
                </p>
              </div>
              <PostReplyOptions
                postId={post._id as string}
                reply={reply}
                setPostReplies={setPostReplies}
              />
            </div>

            <p className="mt-1">{reply.reply}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeReplyClick(reply._id as string)}
              className="mt-2"
            >
              <Heart
                style={{
                  color: il(reply.likes.includes(objId(user?.id))),
                }}
                fill={il(reply.likes.includes(objId(user?.id)))}
                className="mr-2 h-4 w-4"
              />
              {reply.likes.length}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/home"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="font-semibold">Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold text-blue-600">Promptories</h1>
      </div>
    </header>
  );
}

export function PostReplyOptions({
  postId,
  reply,
  setPostReplies,
}: {
  postId: string;
  reply: TReplies;
  setPostReplies: Dispatch<SetStateAction<TReplies[]>>;
}) {
  const { status } = useSession();

  const router = useRouter();

  const handleDeleteReplyClick = async () => {
    try {
      const newReplies = await deleteReply(postId, reply._id as string);
      setPostReplies(newReplies as TReplies[]);
    } catch (error) {
      console.error("Failed to delete reply:", error);
    }
  };

  // const authorized = reply.user._id?.toString() === user._id?.toString();
  const authorized = status === "authenticated";
  console.log(authorized);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"} className="rounded-full">
          <Ellipsis className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Post reply options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {authorized ? (
          <DropdownMenuItem onClick={handleDeleteReplyClick}>
            <Trash className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => router.push(`/${pu(reply).username}`)}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PostOptions({ post }: { post: TPost }) {
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();

  const handleDeletePostClick = async () => {
    try {
      await handleDeletePost(post._id as string);
    } catch (error) {
      console.error(error);
    }
  };

  const authorized = post.user._id?.toString() === user?.id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"} className="rounded-full">
          <Ellipsis className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Post options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {authorized ? (
          <DropdownMenuItem
            onClick={handleDeletePostClick}
            className="cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => router.push(`/${pu(post).username}`)}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        )}
        <Link href={post.model_url} target="_black" prefetch={false}>
          <DropdownMenuItem className="cursor-pointer">
            <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
            <span>Try it</span>
          </DropdownMenuItem>
        </Link>

        {post.chat_link && (
          <Link href={post.chat_link} target="_black" prefetch={false}>
            <DropdownMenuItem className="cursor-pointer">
              <MessageSquareShare className="mr-2 h-4 w-4" />
              <span>View chat</span>
            </DropdownMenuItem>
          </Link>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserOptions() {
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.image} alt={user?.username} />
          <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuItem
          onClick={() => router.push(`/${user?.username}`)}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>{user?.username}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/settings/profile")}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
