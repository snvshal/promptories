import SinglePostPage from "@/components/post";
import { TPost } from "@/types/schema.type";
import { getPostsByPromptoryId } from "@/utils/get-posts";
import { ps } from "@/utils/ps";

export default async function PromptoriesPage({
  params,
}: {
  params: { username: string; promptory_id: string };
}) {
  const { username, promptory_id } = params;
  const post = await getPostsByPromptoryId(username, promptory_id);

  if (!post) {
    return (
      <div className="flex-center h-dvh w-full">
        <p>Post not found!</p>
      </div>
    );
  }

  return <SinglePostPage post={ps(post as TPost)} />;
}
