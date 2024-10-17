"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PostsComponent } from "../home";
import { TPost, TUser } from "@/types/schema.type";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { User2 } from "lucide-react";
import { NavigateBackHeader } from "../post";
import { addFollower } from "@/actions/addFollower";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { st } from "@/utils/ps";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { SetAction } from "@/types/generics.type";
import { Types } from "mongoose";

export default function UserProfileComponent({
  profileUser,
  posts,
  likedPosts,
  bookmarkedPosts,
}: {
  profileUser: TUser;
  posts: TPost[];
  likedPosts: TPost[];
  bookmarkedPosts: TPost[];
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const isAdmin = profileUser._id?.toString() === session?.user?.id;

  const searchParams = useSearchParams();
  const query = searchParams.get("tab");

  // Define the Tab type based on isAdmin
  type Tab = "posts" | "likes" | "saved";

  // Set initial tab based on query or default to "posts"
  const initialTab: Tab =
    isAdmin || query === "posts"
      ? "posts"
      : query === "likes" || query === "saved"
        ? query
        : "posts";

  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    if (query === "posts" || query === "likes" || query === "saved") {
      setTab(query as Tab);
    } else {
      setTab("posts"); // Default to posts if query is invalid
    }
  }, [query]); // Dependency array includes query

  const toggleTab = (tab: string) => {
    setTab(tab as Tab);
    router.push(`?tab=${tab}`);
  };
  return (
    <div className="min-h-screen">
      <NavigateBackHeader page={profileUser.name} />

      <main className="main-content">
        <ProfileUserContent
          profileUser={profileUser}
          postCount={posts.length}
        />

        <Tabs defaultValue={tab} className="w-full">
          <div className="border-b p-4">
            <TabsList
              className={`grid w-full ${isAdmin ? "grid-cols-3" : "grid-cols-1"} `}
            >
              <TabsTrigger
                role="button"
                value="posts"
                onClick={() => toggleTab("posts")}
              >
                Posts
              </TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger
                    role="button"
                    value="likes"
                    onClick={() => toggleTab("likes")}
                  >
                    Likes
                  </TabsTrigger>
                  <TabsTrigger
                    role="button"
                    value="saved"
                    onClick={() => toggleTab("saved")}
                  >
                    Saved
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          <TabsContent value="posts" className="m-0">
            <PostsComponent posts={posts} />
          </TabsContent>
          {isAdmin && (
            <>
              <TabsContent value="likes" className="m-0">
                <PostsComponent posts={likedPosts} />
              </TabsContent>
              <TabsContent value="saved" className="m-0">
                <PostsComponent posts={bookmarkedPosts} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
}

export function ProfileUserContent({
  profileUser,
  postCount,
}: {
  profileUser: TUser;
  postCount: number;
}) {
  const [followers, setFollowers] = useState(profileUser?.following.length);

  return (
    <Card className="mid-width-card-content">
      <CardContent className="pt-6 max-md:px-4 max-sm:pb-4">
        <div className="flex w-full justify-end space-x-4">
          <ProfileOptionButton
            profileUser={profileUser}
            setFollowers={setFollowers}
          />
        </div>
        <div className="sm:flex-start flex max-sm:flex-col">
          <Avatar className="size-32 self-start max-sm:mb-4 sm:mr-3 md:mr-4 md:size-40">
            <AvatarImage src={profileUser?.avatar} alt={profileUser?.name} />
            <AvatarFallback>{profileUser?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex grow flex-col items-start">
            <h2 className="text-2xl font-bold">{profileUser?.name}</h2>
            <p className="text-muted-foreground">
              &#64;{profileUser?.username}
            </p>
            <p className="mt-2">{profileUser?.bio}</p>
            <div className="mt-4 flex items-center space-x-4">
              {profileUser.social_links?.github && (
                <Link
                  href={profileUser.social_links?.github as string}
                  className="text-muted-foreground hover:text-primary"
                >
                  <GitHubLogoIcon className="h-5 w-5" />
                </Link>
              )}
              {profileUser.social_links?.twitter && (
                <Link
                  href={profileUser.social_links?.twitter as string}
                  className="text-muted-foreground hover:text-primary"
                >
                  <TwitterLogoIcon className="h-5 w-5" />
                </Link>
              )}

              {/* <Link href="#" className="text-muted-foreground hover:text-primary">
              <LinkIcon className="h-5 w-5" />
            </Link> */}
            </div>
            <div className="mt-4 flex gap-4">
              <div className="flex gap-1">
                <p className="font-semibold">{postCount}</p>
                <p className="text-muted-foreground">Posts</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">{profileUser?.following.length}</p>
                <p className="text-muted-foreground">Following</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">{followers}</p>
                <p className="text-muted-foreground">Followers</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserNotFound() {
  const { username } = useParams();
  return (
    <div className="min-h-screen">
      <NavigateBackHeader page="User not found" />
      <div className="main-content">
        <Card className="mid-width-card-content max-md:border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage src={""} alt={"user not found!"} />
                <AvatarFallback>
                  <User2 size={48} />
                </AvatarFallback>
              </Avatar>
              <CardHeader className="text-2xl font-bold">
                User Not Found!
              </CardHeader>
              <div className="pb-3">
                <p>
                  We couldn&#39;t find a user with the username &#64;{username}.
                </p>
              </div>
              <CardFooter>
                The user may have changed their username or the account may no
                longer exist.
              </CardFooter>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ProfileOptionButton({
  profileUser,
  setFollowers,
}: {
  profileUser: TUser;
  setFollowers: SetAction<number>;
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const isAdmin = profileUser._id?.toString() === user?.id;

  if (isAdmin) {
    return (
      <Button
        variant="outline"
        onClick={() => router.push("/settings/profile")}
      >
        Edit Profile
      </Button>
    );
  } else {
    return (
      <FollowButton profileUser={profileUser} setFollowers={setFollowers} />
    );
  }
}

export function FollowButton({
  profileUser,
  setFollowers,
}: {
  profileUser: TUser;
  setFollowers: SetAction<number>;
}) {
  const { data: session, update } = useSession();
  const user = session?.user;

  const isAdmin = profileUser._id?.toString() === user?.id;
  const [follow, setFollow] = useState<"Follow" | "Following">();

  useEffect(() => {
    setFollow(
      st(profileUser.followers).includes(user?.id as string)
        ? "Following"
        : "Follow",
    );
  }, [profileUser.followers, user?.id]);

  const handleAddFollower = async () => {
    try {
      type AFRV = {
        updatedState: "Follow" | "Following";
        following: Types.ObjectId[];
      };
      const { updatedState, following }: AFRV = await addFollower(
        profileUser._id as string,
      );

      setFollowers((f) => (follow === "Follow" ? f + 1 : Math.max(f - 1, 0)));

      setFollow(updatedState);
      await update({
        ...session,
        user: {
          ...session?.user,
          following: [...following],
        },
      });
    } catch (error) {
      console.error("Error updating follower state:", error);
    }
  };

  if (isAdmin) return;

  return (
    <Button
      variant={follow === "Follow" ? "default" : "secondary"}
      onClick={handleAddFollower}
    >
      {follow}
    </Button>
  );
}
