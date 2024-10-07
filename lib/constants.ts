import { FormValues } from "@/components/form";

export const promptory_types = [
  "text-to-text",
  "text-to-image",
  "text-to-video",
  "text-to-audio",
  "image-to-text",
  "image-to-image",
  "image-to-video",
  "image-to-audio",
  "video-to-text",
  "video-to-image",
  "video-to-video",
  "video-to-audio",
  "audio-to-text",
  "audio-to-image",
  "audio-to-video",
  "audio-to-audio",
];

export const defaultValues: FormValues = {
  caption: "",
  model_url: "",
  chat_link: "",
  prompt: "",
  response: "",
  promptory_type: promptory_types[0],
  tags: "",
};
