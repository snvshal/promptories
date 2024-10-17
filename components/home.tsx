"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
  ChartNoAxesColumn,
  User,
} from "lucide-react";
import Link from "next/link";
import { TPost, TReplies, TUser } from "@/types/schema.type";
import {
  handleLikePost,
  handleBookmarkPost,
  handlePostView,
} from "@/actions/postActions";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PostType } from "./post";
import { Textarea } from "./ui/textarea";
import { addReplyToPost } from "@/actions/addReplyToPost";
import { objId, st } from "@/utils/ps";
import { useSession } from "next-auth/react";
import { SetAction } from "@/types/generics.type";
import { toast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { promptory_types } from "@/lib/constants";

export const pu = (post: TPost | TReplies) => post.user as TUser;

export function HomePageComponent({ posts }: { posts: TPost[] }) {
  return (
    <div className="min-h-screen w-full">
      <DynamicHeader>
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center">
            <h1 className="mr-8 text-2xl font-bold text-blue-600">
              Promptories
            </h1>
          </div>
        </div>
      </DynamicHeader>
      <main className="main-content">
        <PostsComponent posts={posts} />
      </main>
      <ComposePromptoryButton />
    </div>
  );
}

export function DynamicHeader({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollDiff = Math.abs(scrollTop - lastScrollTop);

      // Only change state if scroll difference exceeds 4rem (64px)
      if (scrollDiff > 64) {
        if (scrollTop > lastScrollTop) {
          // Scrolling down, hide the header
          setIsVisible(false);
        } else {
          // Scrolling up, show the header
          setIsVisible(true);
        }

        setLastScrollTop(scrollTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <header
      className={`sticky top-0 z-10 z-50 w-full border-b bg-background shadow-sm transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } shadow`}
    >
      {children}
    </header>
  );
}

export function PostsComponent({ posts }: { posts: TPost[] }) {
  if (!posts.length) {
    return (
      <div className="flex-center w-full p-4 max-md:pt-10">
        <p>No posts here.</p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post, index) => (
        <PostType key={index} post={post} type="posts" />
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
      const hasLikedInitial = st(post.likes).includes(user.id as string);
      setHasLiked(hasLikedInitial);
    }
  }, [user, post.likes]);

  const handleLikeClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Optimistically update state
      setHasLiked(!hasLiked);
      setLikes(hasLiked ? Math.max(likes - 1, 0) : likes + 1);

      // Server action to handle like/unlike
      await handleLikePost(post._id as string);
    } catch (error) {
      console.error("Failed to save post like");
    }
  };

  return (
    <form onSubmit={handleLikeClick}>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Like Post"
        className="text-muted-foreground"
      >
        <Heart
          style={{ color: il(hasLiked) }}
          fill={il(hasLiked)}
          className="mr-2 size-4"
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
      const initialBookmarks = st(post.bookmarks).includes(user.id as string);
      setHasBookmarked(initialBookmarks);
    }
  }, [user, post.bookmarks]);

  const handleBookmarkClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Optimistically update state
      setHasBookmarked(!hasBookmarked);
      setBookmarks(hasBookmarked ? Math.max(bookmarks - 1, 0) : bookmarks + 1);

      // Server action to handle bookmark/unbookmark
      await handleBookmarkPost(post._id as string);
    } catch (error) {
      console.error("Failed to save post bookmark");
    }
  };

  return (
    <form onSubmit={handleBookmarkClick}>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Bookmark Post"
        className="text-muted-foreground"
      >
        <Bookmark
          style={{ color: ib(hasBookmarked) }}
          fill={ib(hasBookmarked)}
          className="mr-2 size-4"
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
          <Button
            variant="ghost"
            size="sm"
            aria-label="Reply to Post"
            className="text-muted-foreground"
          >
            <MessageCircle className="mr-2 size-4" />
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
            <Send className="mr-2 size-4" />
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

export function Sidebar({
  notificationCount,
  children,
}: {
  notificationCount: number;
  children: ReactNode;
}) {
  const { status } = useSession();

  if (status === "unauthenticated") return null;

  return (
    <div className="flex h-screen w-full overflow-hidden max-sm:flex-col-reverse">
      <nav className="z-50 h-[var(--navbar-height)] border-t border-border bg-background sm:h-dvh sm:w-16 sm:border-r md:w-60">
        <div className="flex h-full flex-col justify-between py-4 max-sm:hidden">
          <div className="flex h-full w-full flex-col items-center justify-start gap-4 sm:px-2 md:px-5">
            <NavLinks notificationCount={notificationCount} />
          </div>
          <UserProfileLink />
        </div>
        <div className="flex h-full items-center justify-around sm:hidden">
          <NavLinks notificationCount={notificationCount} />
          <UserProfileLink />
        </div>
      </nav>
      <div className="flex size-full overflow-auto sm:w-[calc(100%-4rem)] md:w-[calc(100%-15rem)]">
        {children}
      </div>
    </div>
  );
}

export const iv = (status: boolean) => (status ? "secondary" : "ghost");
export const fw = (status: boolean) => (status ? "font-bold" : "font-medium");

export function NavLinks({ notificationCount }: { notificationCount: number }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Button
        size={"icon"}
        onClick={() => router.push("/home")}
        variant={iv(pathname === "/home")}
        className="nav-button"
      >
        <Home className="size-6" />
        <span className={`${fw(pathname === "/home")} text-base max-md:hidden`}>
          Home
        </span>
      </Button>
      <Button
        size={"icon"}
        variant={iv(pathname.startsWith("/search"))}
        onClick={() => router.push("/search")}
        className="nav-button"
      >
        <Search className="size-6" />
        <span
          className={`${fw(pathname.startsWith("/search"))} text-base max-md:hidden`}
        >
          Search
        </span>
      </Button>
      <Button
        size={"icon"}
        onClick={() => router.push("/notifications")}
        variant={iv(pathname === "/notifications")}
        className="nav-button relative"
      >
        {notificationCount > 0 && (
          <Badge className="flex-center absolute right-1 top-1 size-2 p-0">
            {/* {notificationCount <= 10 ? notificationCount : "10+"} */}
          </Badge>
        )}
        <Bell className="size-6" />
        <span
          className={`${fw(pathname === "/notifications")} text-base max-md:hidden`}
        >
          Notifications
        </span>
      </Button>
      <Button
        size={"icon"}
        variant={iv(pathname.startsWith("/settings"))}
        onClick={() => router.push("/settings/profile")}
        className="nav-button"
      >
        <Settings className="size-6" />
        <span
          className={`${fw(pathname.startsWith("/settings"))} text-base max-md:hidden`}
        >
          Settings
        </span>
      </Button>
    </>
  );
}

export function UserProfileLink() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 sm:px-2 md:px-4">
      <Button
        onClick={() => router.push("/compose/promptory")}
        className="w-full self-center rounded-full p-2 max-md:size-10 max-sm:hidden md:h-11"
      >
        <Feather className="size-5 text-base md:hidden" />
        <span className="text-base text-lg max-md:hidden">Post</span>
      </Button>
      <Button
        size={"icon"}
        variant={iv(pathname.slice(1) === user?.username)}
        onClick={() => router.push(`/${user?.username}`)}
        className="size-10 gap-4 rounded-full p-1 sm:size-12 md:flex md:h-14 md:w-full md:items-center md:justify-start md:p-2"
      >
        <Avatar className="max-sm:size-8">
          <AvatarImage src={user?.image} alt={user?.username} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <span className="flex flex-col items-start max-md:hidden">
          <span className="text-base">{user?.name}</span>
          <span className="font-normal text-muted-foreground">
            &#64;{user?.username}
          </span>
        </span>
      </Button>
    </div>
  );
}

export function PostViews({ post }: { post: TPost }) {
  const { data: session } = useSession();
  const user = session?.user;

  const postRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const currentRef = postRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio === 1 &&
            !st(post.views).includes(user?.id as string)
          ) {
            try {
              await handlePostView(post._id as string);
            } catch (error) {
              console.error("Post views not saved");
            }
          }
        });
      },
      {
        threshold: 1.0, // Trigger when 100% of the element is in view
      },
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [post._id, post.views, user?.id]);
  return (
    <Button
      ref={postRef}
      variant="ghost"
      size="sm"
      aria-label="Post Views"
      className="text-muted-foreground"
    >
      <ChartNoAxesColumn className="mr-2 size-4" />
      {post.views.length < 1 ? "" : post.views.length}
      {/* {post.views.length} */}
    </Button>
  );
}

const ptyp = ["text-to-text", "text-to-me"];

export function SidePanel() {
  return (
    <div className="border-box sticky top-0 h-screen w-72 overflow-auto border-l max-lg:hidden">
      <div className="flex-start flex-col p-2">
        <p className="w-full border-b">Side Panel</p>
        {promptory_types.map((type) => (
          <Link href={"/"} className="w-full">
            {type}
          </Link>
        ))}
      </div>
    </div>
  );
}
