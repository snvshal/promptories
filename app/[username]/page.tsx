import UserProfileComponent from "@/components/profile/user";
import { TPost, TUser } from "@/types/schema.type";
import { getPostsByUsername } from "@/utils/get-posts";
import { getUserByUsername } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const user: TUser = await getUserByUsername(username);
  const posts: TPost[] | undefined = await getPostsByUsername(username);

  return <UserProfileComponent user={ps(user)} posts={ps(posts as TPost[])} />;
}
