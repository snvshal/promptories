import PostForm from "@/components/form";
import { TPost } from "@/types/schema.type";
import { getPostById } from "@/utils/get-posts";
import { ps, updatePostValues } from "@/utils/ps";

export default async function UpdatePromptory({
  params,
}: {
  params: { promptory_id: string };
}) {
  const post = await getPostById(params.promptory_id);
  const postValues = updatePostValues(post as TPost);
  return (
    <PostForm
      defaultValues={postValues}
      operationType="PATCH"
      post={ps(post as TPost)}
    />
  );
}
