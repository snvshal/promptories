import UserProfileComponent from "@/components/profile/user";
import { TPost, TUser } from "@/types/schema.type";
import { getPostsByUsername } from "@/utils/get-posts";
import { currentUser, getUserByUsername } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const user = await currentUser();
  const profileUser = await getUserByUsername(username);
  const posts = await getPostsByUsername(username);

  return (
    <UserProfileComponent
      user={ps(user as TUser)}
      profileUser={ps(profileUser as TUser)}
      posts={ps(posts as TPost[])}
    />
  );
}
