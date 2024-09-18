import UserProfileComponent from "@/components/profile/user";
import { getUserByUsername } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const user = await getUserByUsername(params.username);

  return <UserProfileComponent user={ps(user)} />;
}
