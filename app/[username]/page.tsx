import UserProfileComponent, { UserNotFound } from "@/components/profile/user";
import { TPost, TUser } from "@/types/schema.type";
import {
  getBookmarkedPosts,
  getLikedPosts,
  getPostsByUsername,
} from "@/utils/get-posts";

import { getUserByUsername } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  const profileUser = await getUserByUsername(username);

  if (!profileUser) return <UserNotFound />;

  const posts = await getPostsByUsername(username);
  const likedPosts = await getLikedPosts(profileUser as TUser);
  const bookmarkedPosts = await getBookmarkedPosts(profileUser as TUser);

  return (
    <UserProfileComponent
      profileUser={ps(profileUser as TUser)}
      posts={ps(posts as TPost[])}
      likedPosts={ps(likedPosts as TPost[])}
      bookmarkedPosts={ps(bookmarkedPosts as TPost[])}
    />
  );
}
