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
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Share2,
  Send,
  ArrowLeft,
  Heart,
  Trash,
  Ellipsis,
} from "lucide-react";
import Link from "next/link";
import { BookmarkButton, il, LikeButton, pu } from "./home";
import { TimeAgo } from "./time-ago";
import { TPost, TReplies, TUser } from "@/types/schema.type";
import { Types } from "mongoose";
import { addReplyToPost } from "@/actions/addReplyToPost";
import { Separator } from "./ui/separator";
import { deleteReply, handleLikeReply } from "@/actions/handleReplyActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SinglePostPage({
  user,
  post,
}: {
  user: TUser;
  post: TPost;
}) {
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
              {/* <PostOptions /> */}
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
                <p className="whitespace-pre-wrap">{post.response}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="ml-12 flex justify-between">
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
              <Button variant="ghost" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                {post.replies.length}
              </Button>
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
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>
        <PostReplies
          user={user}
          postId={post._id as string}
          replies={post.replies}
        />
      </main>
    </div>
  );
}

export function PostReplies({
  user,
  postId,
  replies,
}: {
  user: TUser;
  postId: string;
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
    const updatedPost = await addReplyToPost(postId, replyText);
    setPostReplies(updatedPost.replies);
    console.log("Reply submitted:", replyText);
    setReplyText("");
    // Here you would typically send the reply to your backend
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
          user={user}
          postId={postId}
          replies={postReplies}
          setPostReplies={setPostReplies}
        />
      </CardContent>
    </Card>
  );
}

export function PostRepliesContent({
  user,
  postId,
  replies,
  setPostReplies,
}: {
  user: TUser;
  postId: string;
  replies: TReplies[];
  setPostReplies: Dispatch<SetStateAction<TReplies[]>>;
}) {
  if (!replies.length) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">No replies here yet!</p>
      </div>
    );
  }

  const handleLikeReplyClick = async (replyId: string) => {
    try {
      const newLikes = await handleLikeReply(postId, replyId);

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
          <Avatar className="h-8 w-8">
            <AvatarImage src={pu(reply).avatar} alt={pu(reply).name} />
            <AvatarFallback>{pu(reply).name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex-between">
              <div className="flex-start space-x-2">
                <p className="font-semibold">{pu(reply).name}</p>
                <p className="text-sm text-muted-foreground">
                  &#64;{pu(reply).username}
                </p>
                <p className="space-x-4 text-sm text-muted-foreground">
                  &#8226; <TimeAgo timestamp={reply.timestamp} />
                </p>
              </div>
              <PostReplyOptions
                postId={postId}
                replyId={reply._id as string}
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
                  color: il(reply.likes.includes(user._id as Types.ObjectId)),
                }}
                fill={il(reply.likes.includes(user._id as Types.ObjectId))}
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
        <h1 className="text-2xl font-bold text-blue-600">Prompto</h1>
      </div>
    </header>
  );
}

export function PostReplyOptions({
  postId,
  replyId,
  setPostReplies,
}: {
  postId: string;
  replyId: string;
  setPostReplies: Dispatch<SetStateAction<TReplies[]>>;
}) {
  const handleDeleteReplyClick = async () => {
    try {
      const newReplies = await deleteReply(postId, replyId);
      setPostReplies(newReplies as TReplies[]);
    } catch (error) {
      console.error("Failed to delete reply:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"} className="rounded-full">
          <Ellipsis className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Post reply options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={handleDeleteReplyClick}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Mock data for a single post
export const post = {
  id: 1,
  title: "Creative Writing Prompt for GPT-4",
  prompt:
    "Write a short story about a world where people communicate only through music.",
  response:
    "In this world, conversations were symphonies, emotions were melodies, and conflicts were resolved through harmonies. The air was constantly filled with a rich tapestry of sounds, each person contributing their unique notes to the grand composition of society. \n\nMaria woke to the gentle pizzicato of raindrops on her window, a natural alarm clock in this melodious realm. She stretched and hummed a cheerful good morning, her pitch perfect and bright. As she stepped outside, the bustling street greeted her with a cacophony of morning rush hour—a fast-paced allegro of hurried commuters and the rhythmic percussion of footsteps.\n\nAt work, Maria collaborated with her team through an intricate fugue, each member adding their own musical phrase to the project at hand. Disagreements were expressed through dissonant chords, quickly resolved into harmonious agreements as they found common ground.\n\nLunchtime brought a medley of flavors, quite literally, as the local café served dishes that sang with spices and textures. Maria ordered her usual—a salad that crisp with refreshing high notes and a soup that resonated with warm, comforting bass tones.\n\nAs evening fell, the city's tempo slowed to a peaceful adagio. Maria met her partner for dinner, their conversation a beautiful duet of intertwining melodies, speaking volumes without a single word. They shared their day through leitmotifs, recurring themes in their personal symphonies.\n\nLater, as Maria drifted off to sleep, the world around her settled into a soft nocturne, the gentle harmonies of a city at rest. In her dreams, she composed new melodies, preparing for another day in this world where music wasn't just heard—it was lived.",
  explanation:
    'To trigger this response, I focused on a sensory experience (music) and framed it in a unique world-building scenario. Phrases like "communicate only through music" steered the AI to explore music beyond sound, as a means of expression, leading to a creative response that focuses on emotions and human connections through melodies.',
  tags: ["CreativeWriting", "AI", "MusicWorld", "GPT4", "Storytelling"],
  likes: 34,
  comments: 12,
  saves: 8,
  user: {
    name: "Alice Johnson",
    username: "@alicewrites",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  postedAt: "2023-06-15T14:30:00Z",
  replies: [
    {
      id: 1,
      user: {
        name: "Bob Smith",
        username: "@bobsmith",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      reply:
        "This is absolutely beautiful! I love how you've woven music into every aspect of daily life.",
      timestamp: "2023-06-15T15:45:00Z",
    },
    {
      id: 2,
      user: {
        name: "Carol White",
        username: "@carolw",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      reply:
        "I'm curious how conflict resolution would work in this world. Would discordant notes represent disagreements?",
      timestamp: "2023-06-15T16:20:00Z",
    },
  ],
};
