import PostForm from "@/components/form";
import { defaultValues } from "@/lib/constants";

export default function CreatePromptory() {
  return <PostForm defaultValues={defaultValues} operationType="POST" />;
}
