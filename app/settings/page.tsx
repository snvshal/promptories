import { redirect } from "next/navigation";

export default async function UsernameSettingsPage() {
  return redirect("/settings/profile");
}
