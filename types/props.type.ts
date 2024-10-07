import { FormValues } from "@/components/form";
import { TPost } from "./schema.type";

export type PostFormProps = OperationType & {
  defaultValues: FormValues;
};

export type OperationType =
  | { operationType: "POST"; post?: never }
  | { operationType: "PATCH"; post: TPost };
