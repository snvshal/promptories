import PostForm from "@/components/form";
import { TPost } from "@/types/schema.type";
import { getPostsByPromptoryId } from "@/utils/get-posts";
import { ps, updatePostValues } from "@/utils/ps";

export default async function UpdatePromptory({
  params,
}: {
  params: { username: string; promptory_id: string };
}) {
  const { username, promptory_id } = params;
  const post = await getPostsByPromptoryId(username, promptory_id);
  const postValues = updatePostValues(post as TPost);
  return (
    <PostForm
      defaultValues={postValues}
      operationType="PATCH"
      post={ps(post as TPost)}
    />
  );
}
