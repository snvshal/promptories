import UserProfileComponent from "@/components/profile/user";

export default function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  return <UserProfileComponent />;
}
