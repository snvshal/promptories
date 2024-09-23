import ProfileSettings from "@/components/settings/profile";
import { TUser } from "@/types/schema.type";
import { currentUser } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function ProfileSettingsPage() {
  const user = await currentUser();
  return <ProfileSettings user={ps(user as TUser)} />;
}
