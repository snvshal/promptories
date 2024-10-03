"use client";

import { useEffect, useState } from "react";
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
import { BookmarkButton, il, LikeButton, PostReplyDialog, pu } from "./home";
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
import { handlePostShare } from "@/utils/ps";
import { useSession } from "next-auth/react";
import { Types } from "mongoose";
import { SetAction } from "@/types/generics.type";

export default function SinglePostPage({ post }: { post: TPost }) {
  const [postReplies, setPostReplies] = useState(post.replies);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="main-content">
        <PostType post={post} type="post" />
        <PostReplies
          post={post}
          postReplies={postReplies}
          setPostReplies={setPostReplies}
        />
      </main>
      <PromptoryReplyButton post={post} setPostReplies={setPostReplies} />
    </div>
  );
}

export function PostReplies({
  post,
  postReplies,
  setPostReplies,
}: {
  post: TPost;
  postReplies: TReplies[];
  setPostReplies: SetAction<TReplies[]>;
}) {
  const [replyText, setReplyText] = useState("");
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
    <Card className="mid-width-post-card">
      <CardHeader className="max-md:p-4">
        <CardTitle className="text-lg font-semibold">Replies</CardTitle>
      </CardHeader>
      <CardContent className="max-md:px-4">
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

export const tsa = (a: Types.ObjectId[]) =>
  a.map((i) => i.toString() as string);

export function PostRepliesContent({
  post,
  replies,
  setPostReplies,
}: {
  post: TPost;
  replies: TReplies[];
  setPostReplies: SetAction<TReplies[]>;
}) {
  const { data: session } = useSession();
  const user = session?.user;

  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user && replies?.length) {
      const hasLikedInitial: Record<string, boolean> = {};
      replies.forEach((reply: TReplies) => {
        hasLikedInitial[reply._id?.toString() as string] = tsa(
          reply.likes as Types.ObjectId[],
        ).includes(user?.id);
      });
      setHasLiked(hasLikedInitial);
    }
  }, [user, replies]);

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

      setHasLiked((prev) => {
        return { ...prev, [replyId]: !prev[replyId] };
      });
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

            <div className="flex items-start justify-between gap-2">
              <p>{reply.reply}</p>
              <div className="flex-start flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLikeReplyClick(reply._id as string)}
                  className="hover:bg-background"
                >
                  <Heart
                    style={{
                      color: il(hasLiked[reply._id?.toString() as string]),
                    }}
                    fill={il(hasLiked[reply._id?.toString() as string])}
                    className="h-4 w-4"
                  />
                </Button>
                <p className="text-sm text-muted-foreground">
                  {reply.likes.length}
                </p>
              </div>
            </div>
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
  setPostReplies: SetAction<TReplies[]>;
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
  // console.log(authorized);

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
      <DropdownMenuContent className="w-auto">
        <DropdownMenuItem
          onClick={() => router.push(`/${user?.username}`)}
          className="cursor-pointer sm:hidden"
        >
          <User className="mr-2 h-4 w-4" />
          <span>&#64;{user?.username}</span>
        </DropdownMenuItem>
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
      <DropdownMenuContent className="w-auto">
        <DropdownMenuItem
          onClick={() => router.push(`/${user?.username}`)}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>{user?.name}</span>
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

export function PromptoryReplyButton({
  post,
  setPostReplies,
}: {
  post: TPost;
  setPostReplies: SetAction<TReplies[]>;
}) {
  return (
    <PostReplyDialog post={post} setPostReplies={setPostReplies}>
      <Button
        size={"icon"}
        className="fixed bottom-20 right-10 h-12 w-12 rounded-full border bg-primary p-2 md:bottom-10"
      >
        <MessageCircle size={24} />
      </Button>
    </PostReplyDialog>
  );
}

export function PostType({
  post,
  type,
}: {
  post: TPost;
  type: "post" | "posts";
}) {
  const router = useRouter();

  const postClick = (post: TPost) =>
    router.push(`/${pu(post).username}/promptories/${post.promptory_id}`);

  return (
    <Card className="mid-width-post-card">
      <CardHeader className="pb-0 max-md:px-4">
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
                <p
                  className={`text-muted-foreground ${type === "posts" && "max-sm:hidden"}`}
                >
                  &#64;{pu(post).username}
                </p>
              </div>
            </Link>
            {type === "posts" && (
              <p className="text-sm text-muted-foreground">
                &#8226; <TimeAgo timestamp={post.createdAt as Date} />
              </p>
            )}
          </div>
          <PostOptions post={post} />
        </div>
      </CardHeader>
      <CardContent
        role={type === "posts" ? "button" : undefined}
        onClick={type === "posts" ? () => postClick(post) : undefined}
        className="border-0 pl-20 max-md:pr-4 max-sm:pl-[4.5rem]"
      >
        <div className="mb-4">
          <div className="relative overflow-hidden">
            <PostContentType type={type} content={post.caption} />
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
            <PostContentType type={type} content={post.prompt} />
          </div>
          <div className="relative overflow-hidden">
            <h3 className="mb-2 font-semibold">Response:</h3>
            <PostContentType type={type} content={post.response} />
          </div>
        </div>
      </CardContent>
      {type === "post" && <PostTime createdAt={post.createdAt as Date} />}
      <CardFooter className="flex justify-between pl-[4.5rem] max-md:pr-4 sm:pl-20">
        <div className="flex space-x-4">
          {/* Like Button */}
          <LikeButton post={post} />
          {/* Reply Button */}
          <PostReplyDialog post={post} />
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
  );
}

export function PostContentType({
  type,
  content,
}: {
  type: "post" | "posts";
  content: string;
}) {
  if (type === "post") {
    return <p className="whitespace-pre-wrap">{content}</p>;
  } else {
    return (
      <>
        <p className="whitespace-pre-wrap">
          {content.split(" ").slice(0, 24).join(" ")}
          {content.split(" ").length > 24 && <span> ...</span>}
        </p>
        {content.split(" ").length > 24 && (
          <button className="text-blue-500 hover:underline">Show more</button>
        )}
      </>
    );
  }
}

export function PostTime({ createdAt }: { createdAt: Date }) {
  return (
    <div className="flex-start mb-6 ml-[4.5rem] mr-4 border-b pb-6 text-muted-foreground sm:ml-20 md:mr-6">
      {new Date(createdAt as Date).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}{" "}
      &#8226;{" "}
      {new Date(createdAt as Date).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </div>
  );
}
