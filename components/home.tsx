"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Bell,
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Feather,
  Home,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { TPost, TReplies, TUser } from "@/types/schema.type";
import {
  handleLikePost,
  handleBookmarkPost,
} from "@/actions/handlePostActions";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PostType, tsa, UserOptions } from "./post";
import { Textarea } from "./ui/textarea";
import { addReplyToPost } from "@/actions/addReplyToPost";
import { objId } from "@/utils/ps";
import { useSession } from "next-auth/react";
import { SetAction } from "@/types/generics.type";
import { toast } from "@/hooks/use-toast";

export const pu = (post: TPost | TReplies) => post.user as TUser;

export function HomePageComponent({ posts }: { posts: TPost[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const SubmitQuery = async (e: FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${searchQuery}`);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background shadow-sm sm:pl-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h1 className="mr-8 text-2xl font-bold text-blue-600">
              Promptories
            </h1>
          </div>
          <div className="flex items-center space-x-4 max-md:hidden">
            <form onSubmit={SubmitQuery}>
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
            </form>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserOptions />
          </div>
        </div>
      </header>

      <main className="main-content">
        <PostsComponent posts={posts} />
      </main>

      <ComposePromptoryButton />
    </div>
  );
}

export function PostsComponent({ posts }: { posts: TPost[] }) {
  if (!posts.length) {
    return (
      <div className="flex-center w-full p-4">
        <p>No posts here.</p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <div data-key={post._id?.toString()} key={post._id?.toString()}>
          <PostType post={post} type="posts" />
        </div>
      ))}
    </>
  );
}

export const il = (hasLiked: boolean) => (hasLiked ? "#b91c1c" : "none");

export const LikeButton = ({ post }: { post: TPost }) => {
  const { data: session } = useSession();
  const user = session?.user;

  const initialLikes = post.likes.length;

  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id) {
      const hasLikedInitial = tsa(post.likes).includes(user.id as string);
      setHasLiked(hasLikedInitial);
    }
  }, [user, post.likes]);

  const handleLikeClick = async (e: React.FormEvent) => {
    e.preventDefault();

    // Optimistically update state
    setHasLiked(!hasLiked);
    setLikes(hasLiked ? likes - 1 : likes + 1);

    // Server action to handle like/unlike
    await handleLikePost(post._id as string);
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

export const ib = (isSaved: boolean) => (isSaved ? "#3b82f6" : "none");

export const BookmarkButton = ({ post }: { post: TPost }) => {
  const { data: session } = useSession();
  const user = session?.user;

  const initialBookmarks = post.bookmarks.length;
  const hasBookmarkedInitial = post.bookmarks.includes(objId(user?.id));

  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [hasBookmarked, setHasBookmarked] = useState(hasBookmarkedInitial);

  useEffect(() => {
    if (user?.id) {
      const initialBookmarks = tsa(post.bookmarks).includes(user.id as string);
      setHasBookmarked(initialBookmarks);
    }
  }, [user, post.bookmarks]);

  const handleBookmarkClick = async (e: React.FormEvent) => {
    e.preventDefault();

    // Optimistically update state
    setHasBookmarked(!hasBookmarked);
    setBookmarks(hasBookmarked ? bookmarks - 1 : bookmarks + 1);

    // Server action to handle bookmark/unbookmark
    await handleBookmarkPost(post._id as string, user?.id as string);
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

export function PostReplyDialog({
  post,
  children,
  setPostReplies,
}: {
  post: TPost;
  children?: React.ReactNode;
  setPostReplies?: SetAction<TReplies[]>;
}) {
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
      const updatedPost: TPost = await addReplyToPost(
        post._id as string,
        replyContent,
      );

      console.log(updatedPost);
      if (setPostReplies) setPostReplies(updatedPost.replies);

      setRepliesCount((prev) => prev + 1);
      console.log("Reply submitted:", replyContent);
      setReplyContent("");
      setDialogState(false);
      // Here you would typically send the reply to your backend
      toast({
        description: "Your reply has been sent.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your reply.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="ghost" size="sm" aria-label="Reply to Post">
            <MessageCircle className="mr-2 h-4 w-4" />
            {repliesCount}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Reply to{" "}
            <Link href={`/${pu(post).username}`} className="text-blue-500">
              &#64;{pu(post).username}
            </Link>
          </DialogTitle>
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

export function ComposePromptoryButton() {
  const router = useRouter();
  return (
    <Button
      size={"icon"}
      onClick={() => router.push("/compose/promptory")}
      className="compose-button"
    >
      <Feather size={24} />
    </Button>
  );
}

export function Navbar() {
  const { status } = useSession();

  if (status === "unauthenticated") return null;

  return (
    <nav className="fixed bottom-0 left-0 z-50 h-[var(--navbar-height)] border-t border-border bg-background max-sm:right-0 sm:top-0 sm:h-dvh sm:w-[var(--navbar-height)] sm:border-r md:hidden">
      <div className="flex h-full flex-col justify-between py-4 max-sm:hidden">
        <div className="flex h-full w-full flex-col justify-start gap-4">
          <NavLinks />
        </div>
        <UserProfileLink />
      </div>
      <div className="flex h-full items-center justify-around sm:hidden">
        <NavLinks />
        <UserProfileLink />
      </div>
    </nav>
  );
}

export function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      <Link href="/home" className="flex flex-col items-center p-2">
        <Home
          className="h-6 w-6"
          fill={pathname.startsWith("/home") ? "currentColor" : "none"}
        />
      </Link>
      <Link href="/search" className="flex flex-col items-center p-2">
        <Search
          className="h-6 w-6"
          strokeWidth={pathname.startsWith("/search") ? 4 : 2}
        />
      </Link>
      <Link href="/settings/profile" className="flex flex-col items-center p-2">
        <Settings
          className="h-6 w-6"
          fill={pathname.startsWith("/settings") ? "currentColor" : "none"}
        />
      </Link>
      <Link href="/notifications" className="flex flex-col items-center p-2">
        <Bell
          className="h-6 w-6"
          fill={pathname.startsWith("/notifications") ? "currentColor" : "none"}
        />
      </Link>
    </>
  );
}

export function UserProfileLink() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <Link
      href={`/${user?.username}`}
      className="flex flex-col items-center p-2"
    >
      <Avatar className="cursor-pointer">
        <AvatarImage src={user?.image} alt={user?.username} />
        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
      </Avatar>
    </Link>
  );
}
