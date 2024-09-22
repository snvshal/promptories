import { pu } from "@/components/home";
import { TPost } from "@/types/schema.type";

export const ps = (obj: object) => JSON.parse(JSON.stringify(obj));

export const isValidPromptoryId = (promptory_id: string): boolean => {
  if (!promptory_id) return false;

  const idAsNumber = Number(promptory_id);
  if (isNaN(idAsNumber)) return false;

  const currentTimestamp = Date.now();
  const earliestValidTimestamp = new Date("1970-01-01").getTime();

  // Check if the ID falls within valid timestamp range
  return idAsNumber >= earliestValidTimestamp && idAsNumber <= currentTimestamp;
};

export const handlePostShare = async (post: TPost) => {
  const postUrl = `${process.env.METADATA_BASE_URL}/${pu(post).username}/promptories/${post.promptory_id}`; // Replace with dynamic post URL

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check out this post!",
        url: postUrl,
      });
    } catch (error) {
      console.error("Error sharing", error);
    }
  } else {
    // Fallback for copying the link
    navigator.clipboard.writeText(postUrl);
    alert("Link copied to clipboard");
  }
};
