import ChangeUsernamePage from "@/components/settings/username";
import { TUser } from "@/types/schema.type";
import { currentUser } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function UsernameSettingsPage() {
  const user = await currentUser();
  return <ChangeUsernamePage user={ps(user as TUser)} />;
}
