import { FormValues } from "@/components/form"
import { PRMedia, TPost } from "./schema.type"

export type PostFormProps = OperationType & {
  defaultFormValues: FormValues
  media: PostFormMedia
}

export type PostFormMedia = { prompt: PRMedia; response: PRMedia }
export type OperationType =
  | { operationType: "POST"; post?: never }
  | { operationType: "PATCH"; post: TPost }
