import { HomePageComponent } from "@/components/home";
import { TPost } from "@/types/schema.type";
import { getPosts } from "@/utils/get-posts";
import { ps } from "@/utils/ps";

export default async function HomePage() {
  const posts = await getPosts();

  return <HomePageComponent posts={ps(posts as TPost[])} />;
}
