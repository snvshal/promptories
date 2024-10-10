import SinglePostPage from "@/components/post";
import { TPost } from "@/types/schema.type";
import { getPostById } from "@/utils/get-posts";
import { ps } from "@/utils/ps";

export default async function PromptoriesPage({
  params,
}: {
  params: { promptory_id: string };
}) {
  const post = await getPostById(params.promptory_id);

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
