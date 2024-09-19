import { HomePageComponent } from "@/components/home";
import { TPost } from "@/types/schema.type";
import { getPosts } from "@/utils/get-posts";
import { currentUser } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function HomePage() {
  const user = await currentUser();
  const posts = await getPosts();

  // await cleanPosts();

  return <HomePageComponent user={ps(user)} posts={ps(posts as TPost[])} />;
}
