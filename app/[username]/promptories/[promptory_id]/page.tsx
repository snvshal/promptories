import SinglePostPage from "@/components/post";
import { TPost, TUser } from "@/types/schema.type";
import { getPostsByPromptoryId } from "@/utils/get-posts";
import { currentUser } from "@/utils/get-user";
import { ps } from "@/utils/ps";

export default async function PromptoriesPage({
  params,
}: {
  params: { username: string; promptory_id: string };
}) {
  const { username, promptory_id } = params;
  const user = await currentUser();
  const post = await getPostsByPromptoryId(username, promptory_id);
  console.log(post);

  return <SinglePostPage user={ps(user as TUser)} post={ps(post as TPost)} />;
}
