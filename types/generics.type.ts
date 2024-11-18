import { Document, Types } from "mongoose"
import { Dispatch, SetStateAction } from "react"
import { TAIChat, TNotification, TPost, TReplies } from "./schema.type"

export type SetAction<T> = Dispatch<SetStateAction<T>>

export type RemoveMongooseFields<T> = Omit<T, keyof Document>

export type Populate<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: Exclude<T[P], Types.ObjectId>
}

export type AIChatPT = Populate<TAIChat, "user">
export type PostPT = Populate<TPost, "user">
export type RepliesPT = Populate<TReplies, "user">
export type NotificationPT = Populate<TNotification, "user">
