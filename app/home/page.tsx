import { HomePageComponent } from "@/components/home";
import { currentUser } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function HomePage() {
  const user = await currentUser();
  return <HomePageComponent user={ps(user)} />;
}
