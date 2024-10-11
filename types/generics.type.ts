import { Document } from "mongoose";
import { Dispatch, SetStateAction } from "react";

export type SetAction<T> = Dispatch<SetStateAction<T>>;

export type RemoveMongooseFields<T> = Omit<T, keyof Document>;
