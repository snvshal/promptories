import SinglePostPage from "@/components/post";
import { TPost } from "@/types/schema.type";
import { getPostByPromptoryId } from "@/utils/get-posts";
import { ps } from "@/utils/ps";

export default async function PromptoriesPage({
  params,
}: {
  params: { username: string; promptory_id: string };
}) {
  const { username, promptory_id } = params;
  const post = await getPostByPromptoryId(username, promptory_id);

  if (!post) {
    return (
      <main className="main-content">
        <div className="flex-center mt-40 w-full">
          <p>Post not found!</p>
        </div>
      </main>
    );
  }

  return <SinglePostPage post={ps(post as TPost)} />;
}
